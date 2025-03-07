import os
import time
import json
import os
import time
import json
import firebase_admin
from firebase_admin import credentials, firestore
import watchdog
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import watchdog
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from dotenv import load_dotenv
from hashlib import sha256
from hashlib import sha256

# Load environment variables
# Load environment variables
load_dotenv()

# Firebase credentials

# Firebase credentials
FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
FIREBASE_PRIVATE_KEY = os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n')  # Fix newlines
FIREBASE_PRIVATE_KEY = os.getenv('FIREBASE_PRIVATE_KEY').replace('\\n', '\n')  # Fix newlines
FIREBASE_CLIENT_EMAIL = os.getenv('FIREBASE_CLIENT_EMAIL')

firebase_config = {
    "type": "service_account",
    "project_id": FIREBASE_PROJECT_ID,
    "private_key": FIREBASE_PRIVATE_KEY,
    "client_email": FIREBASE_CLIENT_EMAIL,
    "token_uri": "https://oauth2.googleapis.com/token"
}

# Initialize Firebase Admin SDK if not already initialized
# Initialize Firebase Admin SDK if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_config)
    firebase_admin.initialize_app(cred)

# Firestore reference
# Firestore reference
db = firestore.client()

# Path to the JSON file
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "../backend/devices.json")

# Track last JSON hash to avoid unnecessary updates
last_json_hash = None


def hash_file_content(file_path):
    """Calculate SHA256 hash of the file content."""
    with open(file_path, "r") as f:
        content = f.read()
    return sha256(content.encode()).hexdigest()


def update_firestore():
    """Sync JSON data with Firestore."""
    global last_json_hash

    new_hash = hash_file_content(JSON_FILE_PATH)
    if new_hash == last_json_hash:
        print("No changes detected in JSON. Skipping Firestore update.")
        return  # Skip update if the content hasn't changed

    last_json_hash = new_hash  # Update hash

    with open(JSON_FILE_PATH, "r") as f:
        data = json.load(f)

    # Filter devices that are "connected"
# Path to the JSON file
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), "../backend/devices.json")

# Track last JSON hash to avoid unnecessary updates
last_json_hash = None


def hash_file_content(file_path):
    """Calculate SHA256 hash of the file content."""
    with open(file_path, "r") as f:
        content = f.read()
    return sha256(content.encode()).hexdigest()


def update_firestore():
    """Sync JSON data with Firestore."""
    global last_json_hash

    new_hash = hash_file_content(JSON_FILE_PATH)
    if new_hash == last_json_hash:
        print("No changes detected in JSON. Skipping Firestore update.")
        return  # Skip update if the content hasn't changed

    last_json_hash = new_hash  # Update hash

    with open(JSON_FILE_PATH, "r") as f:
        data = json.load(f)

    # Filter devices that are "connected"
    filtered_devices = [
        {key: device[key] for key in ["id", "name", "ip"]}
        for device in data["smart_home_devices"]
        if device.get("connection_status") == "connected"
    ]

    existing_devices = {doc.id: doc.to_dict() for doc in db.collection("Devices").stream()}


    existing_devices = {doc.id: doc.to_dict() for doc in db.collection("Devices").stream()}

    added_devices = []
    modified_devices = []
    deleted_devices = []

    new_device_ids = {str(device["id"]) for device in filtered_devices}


    new_device_ids = {str(device["id"]) for device in filtered_devices}

    # Add or update devices
    for device in filtered_devices:
        device_id = str(device["id"])
        device_id = str(device["id"])
        if device_id not in existing_devices:
            db.collection("Devices").document(device_id).set(device)
            db.collection("Devices").document(device_id).set(device)
            added_devices.append(device)
        elif existing_devices[device_id] != device:
            db.collection("Devices").document(device_id).set(device)
            db.collection("Devices").document(device_id).set(device)
            modified_devices.append(device)

    # Delete devices not in the JSON anymore

    # Delete devices not in the JSON anymore
    for device_id in existing_devices.keys():
        if device_id not in new_device_ids:
            db.collection("Devices").document(device_id).delete()
            db.collection("Devices").document(device_id).delete()
            deleted_devices.append(device_id)

    # Logging updates
    if added_devices:
        print(f"Added devices: {added_devices}")
    if modified_devices:
        print(f"Updated devices: {modified_devices}")
    if deleted_devices:
        print(f"Deleted devices: {deleted_devices}")

    # Logging updates
    if added_devices:
        print(f"Added devices: {added_devices}")
    if modified_devices:
        print(f"Updated devices: {modified_devices}")
    if deleted_devices:
        print(f"Deleted devices: {deleted_devices}")

def is_json_updated(file):
    """Check if JSON file has been modified."""
    global LAST_MODIFIED_TIME
    current_modified_time = os.path.getmtime(file)
    if current_modified_time > LAST_MODIFIED_TIME:
        LAST_MODIFIED_TIME = current_modified_time
        return True
    return False


