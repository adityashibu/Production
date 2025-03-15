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

# Firebase configuration
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

# Path to the JSON file
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "../database/users_db.json")

# Hash password function
def hash_password(password):
    """Hash password using bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

# Fetch existing users from Firestore
def get_existing_users(coll_ref):
    """Fetch existing users and their password hashes."""
    return {doc.id: doc.to_dict() for doc in coll_ref.stream()}

# Function to update Firestore
def set_users_data():
    """Sync users_db.json data with Firestore, ensuring password consistency."""
    if not os.path.exists(JSON_FILE_PATH):
        print(f"Error: {JSON_FILE_PATH} not found.")
        return

    with open(JSON_FILE_PATH, "r") as JSONfile:
        data = json.load(JSONfile)

    existing_users = get_existing_users(db.collection("Profile"))
    filtered_users = {}

    for user in data.get("users", []):
        user_id = str(user["user_id"])
        new_password = user["user_password"]

        # Preserve password hash if the password hasn't changed
        if user_id in existing_users and bcrypt.checkpw(new_password.encode(), existing_users[user_id]["user_password"].encode()):
            hashed_password = existing_users[user_id]["user_password"]  # Keep existing hash
        else:
            hashed_password = hash_password(new_password)  # Generate new hash

        # Convert allocated device IDs to Firestore references
        allocated_devices = [
            db.collection("Device").document(str(device_id))
            for device_id in user.get("allocated_devices", [])
        ]

        filtered_users[user_id] = {
            "user_id": user["user_id"],
            "user_name": user["user_name"],
            "user_password": hashed_password,  # Use existing hash if unchanged
            "allocated_devices": allocated_devices,
            "user_role": user["user_role"]
        }

    added_users, modified_users, deleted_users = [], [], []

    # Add or update users
    for user_id, user_data in filtered_users.items():
        if user_id not in existing_users:
            db.collection("Profile").document(user_id).set(user_data)
            added_users.append(user_data)
        elif existing_users[user_id] != user_data:
            db.collection("Profile").document(user_id).set(user_data)
            modified_users.append(user_data)

    # Delete outdated users no longer in the JSON
    for user_id in existing_users.keys():
        if user_id not in filtered_users:
            db.collection("Profile").document(user_id).delete()
            deleted_users.append(user_id)

    # Logging changes
    if added_users:
        print(f"Added users: {added_users}")
    if modified_users:
        print(f"Updated users: {modified_users}")
    if deleted_users:
        print(f"Deleted outdated users: {deleted_users}")

# Watchdog Event Handler
class UsersFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        """Triggered when users_db.json is modified."""
        if event.src_path.endswith("users_db.json"):
            print("Detected changes in users_db.json, updating Firestore...")
            set_users_data()

# Watchdog Observer
def watch_users_file():
    """Monitor users_db.json for changes and update Firestore in real-time."""
    users_file_path = os.path.dirname(JSON_FILE_PATH)
    
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
set_users_data()

# Run the watchdog file watcher
watch_users_file()
