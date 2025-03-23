import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
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
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "../backend/automations.json")

# Fetch existing automations from Firestore
def get_existing_automations(coll_ref):
    """Fetch existing automations from Firestore."""
    return {doc.id: doc.to_dict() for doc in coll_ref.stream()}

# Function to update Firestore
def set_automations_data():
    """Sync automations.json data with Firestore."""
    if not os.path.exists(JSON_FILE_PATH):
        print(f"Error: {JSON_FILE_PATH} not found.")
        return

    with open(JSON_FILE_PATH, "r") as JSONfile:
        data = json.load(JSONfile)

    existing_automations = get_existing_automations(db.collection("Automations"))
    filtered_automations = {}

    for automation in data.get("automations", []):
        if not automation["enabled"]:  # Only store enabled automations
            continue

        automation_id = str(automation["id"])

        # Convert single device ID to list if necessary
        device_ids = automation["device_id"]
        if not isinstance(device_ids, list):
            device_ids = [device_ids]

        # Convert to Firestore references
        device_refs = [db.collection("Device").document(str(device_id)) for device_id in device_ids]

        filtered_automations[automation_id] = {
            "id": automation["id"],
            "name": automation["name"],
            "device_ids": device_refs,  # Store as a list of Firestore references 
            "triggers": automation["triggers"],
            "status": automation["status"]
        }

    added_automations, modified_automations, deleted_automations = [], [], []

    # Add or update automations
    for automation_id, automation_data in filtered_automations.items():
        if automation_id not in existing_automations:
            db.collection("Automation").document(automation_id).set(automation_data)
            added_automations.append(automation_data)
        elif existing_automations[automation_id] != automation_data:
            db.collection("Automation").document(automation_id).set(automation_data)
            modified_automations.append(automation_data)

    # Delete outdated automations no longer in the JSON
    for automation_id in existing_automations.keys():
        if automation_id not in filtered_automations:
            db.collection("Automation").document(automation_id).delete()
            deleted_automations.append(automation_id)

    # Logging changes
    if added_automations:
        print(f"Added automations: {added_automations}")
    if modified_automations:
        print(f"Updated automations: {modified_automations}")
    if deleted_automations:
        print(f"Deleted outdated automations: {deleted_automations}")

# Watchdog Event Handler
class AutomationsFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        """Triggered when automations.json is modified."""
        if event.src_path.endswith("automations.json"):
            print("Detected changes in automations.json, updating Firestore...")
            set_automations_data()

# Watchdog Observer
def watch_automations_file():
    """Monitor automations.json for changes and update Firestore in real-time."""
    automations_file_path = os.path.dirname(JSON_FILE_PATH)
    
    event_handler = AutomationsFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path=automations_file_path, recursive=False)
    
    observer.start()
    print("Watching for changes in automations.json...")

    try:
        while True:
            time.sleep(1)  # Keep script running
    except KeyboardInterrupt:
        observer.stop()
    
    observer.join()

# Run initial Firestore sync
print("Syncing Firestore with automations.json on startup...")
set_automations_data()

# Run the watchdog file watcher
watch_automations_file()
