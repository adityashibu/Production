import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
#rom dotenv import load_dotenv

cred = credentials.Certificate("/Users/annerinjeri/Downloads/powerhouse-62f4d-firebase-adminsdk-fbsvc-9a2e946c98.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

#load_dotenv()

LAST_MODIFIED_TIME = 0

def get_existing_devices(coll_ref):
    """Fetch existing devices from Firestore."""
    existing_devices = {}
    docs = coll_ref.stream()
    for doc in docs:
        data = doc.to_dict()
        existing_devices[doc.id] = data  # Use Firestore document ID
    return existing_devices

def set_doc_data(coll_ref, file):
    """Compare JSON data with Firestore and update only necessary records."""
    rel_path = os.path.join(os.path.dirname(__file__), f"../backend/{file}")
    with open(rel_path, "r") as JSONfile:
        data = json.load(JSONfile)
    
    filtered_devices = [
        {key: device[key] for key in ["id", "name", "ip"]}
        for device in data["smart_home_devices"]
        if device.get("connection_status") == "connected"
    ]
    
    existing_devices = get_existing_devices(coll_ref)
    new_device_ids = {str(device["id"]) for device in filtered_devices}  # Convert IDs to string
    
    # Track changes
    added_devices = []
    modified_devices = []
    deleted_devices = []
    
    # Add or update devices
    for device in filtered_devices:
        device_id = str(device["id"])  # Ensure document ID is a string
        if device_id not in existing_devices:
            coll_ref.document(device_id).set(device)
            added_devices.append(device)
        elif existing_devices[device_id] != device:
            coll_ref.document(device_id).set(device)
            modified_devices.append(device)
    
    # Delete outdated devices no longer in the JSON
    for device_id in existing_devices.keys():
        if device_id not in new_device_ids:
            coll_ref.document(device_id).delete()
            deleted_devices.append(device_id)
    
    # Logging changes
    for device in added_devices:
        print(f"Added device: {device}")
    for device in modified_devices:
        print(f"Updated device: {device}")
    for device_id in deleted_devices:
        print(f"Deleted outdated device: {device_id}")

'''def is_json_updated(file):
    """Check if JSON file has been modified."""
    global LAST_MODIFIED_TIME
    current_modified_time = os.path.getmtime(file)
    if current_modified_time > LAST_MODIFIED_TIME:
        LAST_MODIFIED_TIME = current_modified_time
        return True
    return False'''

#if is_json_updated("../backend/devices.json"):
set_doc_data(db.collection("Devices"), "devices.json")
