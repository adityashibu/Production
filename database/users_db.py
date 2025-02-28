import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
#rom dotenv import load_dotenv

cred = credentials.Certificate("/Users/annerinjeri/Downloads/powerhouse-62f4d-firebase-adminsdk-fbsvc-9a2e946c98.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

#load_dotenv()
def_set_doc_data(collref,)
# Load JSON file
with open("users.json", "r") as file:
    data = json.load(file)

# Upload users to Firestore with device references
for user in data["users"]:
    user_id = user["user_name"].replace(" ", "_").lower()  # Unique Firestore ID
    user_ref = db.collection("Users").document(user_id)

    # Convert device IDs into Firestore document references
    device_refs = [db.collection("Devices").document(device_id) for device_id in user["allocated_devices"]]

    user_data = {
        "user_name": user["user_name"],
        "user_password": user["user_password"],  # Password stored as plain text (⚠ Not recommended for production)
        "allocated_devices": device_refs,  # Store Firestore document references
        "user_role": user["user_role"]
    }

    user_ref.set(user_data)
    print(f"User {user['user_name']} added with device references!")

