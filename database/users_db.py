import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
import bcrypt
import time
from dotenv import load_dotenv
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Load environment variables
load_dotenv()

# Read Firebase credentials from .env
firebase_config = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key": (os.getenv("FIREBASE_PRIVATE_KEY") or "").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "token_uri": "https://oauth2.googleapis.com/token"
}

# Initialize Firebase Admin SDK if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Hash password function
def hash_password(password):
    """Hash password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

# Get existing users from Firestore
def get_existing_users(coll_ref):
    """Fetch existing users from Firestore."""
    return {doc.id: doc.to_dict() for doc in coll_ref.stream()}

# Function to update Firestore
def set_users_data(coll_ref, file):
    """Compare JSON data with Firestore and update only necessary records."""
    rel_path = os.path.join(os.path.dirname(__file__), f"../database/{file}")
    
    if not os.path.exists(rel_path):
        print(f"Error: {file} not found at {rel_path}")
        return
    
    with open(rel_path, "r") as JSONfile:
        data = json.load(JSONfile)

    # Convert allocated device IDs to Firestore document references
    def get_device_refs(device_ids):
        return [db.collection("Devices").document(str(device_id)) for device_id in device_ids]
    
    filtered_users = {
        str(user["user_id"]): {
            "user_id": user["user_id"],
            "user_name": user["user_name"],
            "user_password": hash_password(user["user_password"]),  # Hash password
            "allocated_devices": get_device_refs(user.get("allocated_devices", [])),
            "user_role": user["user_role"]
        }
        for user in data.get("users", [])
    }

    existing_users = get_existing_users(coll_ref)

    added_users, modified_users, deleted_users = [], [], []

    # Add or update users
    for user_id, user_data in filtered_users.items():
        if user_id not in existing_users:
            coll_ref.document(user_id).set(user_data)
            added_users.append(user_data)
        elif existing_users[user_id] != user_data:
            coll_ref.document(user_id).set(user_data)
            modified_users.append(user_data)

    # Delete outdated users no longer in the JSON
    for user_id in existing_users.keys():
        if user_id not in filtered_users:
            coll_ref.document(user_id).delete()
            deleted_users.append(user_id)

    # Logging changes
    for user in added_users:
        print(f"Added user: {user}")
    for user in modified_users:
        print(f"Updated user: {user}")
    for user_id in deleted_users:
        print(f"Deleted outdated user: {user_id}")

# Watchdog Event Handler
class UsersFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        """Triggered when users_db.json is modified"""
        if event.src_path.endswith("users_db.json"):
            print("Detected changes in users_db.json, updating Firestore...")
            set_users_data(db.collection("Users"), "users_db.json")

# Watchdog Observer
def watch_users_file():
    """Monitor users_db.json for changes and update Firestore in real-time."""
    users_file_path = os.path.join(os.path.dirname(__file__), "../database")
    
    event_handler = UsersFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path=users_file_path, recursive=False)
    
    observer.start()
    print("Watching for changes in users_db.json...")

    try:
        while True:
            time.sleep(1)  # Keep script running
    except KeyboardInterrupt:
        observer.stop()
    
    observer.join()

# Run initial Firestore sync
print("Syncing Firestore with users_db.json on startup...")
set_users_data(db.collection("Users"), "users_db.json")

# Run the watchdog file watcher
watch_users_file()
