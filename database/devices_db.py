import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
import os 

cred = credentials.Certificate("/Users/annerinjeri/Downloads/powerhouse-62f4d-firebase-adminsdk-fbsvc-9a2e946c98.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

LAST_MODIFIED_TIME = 0

def set_doc_data(coll_ref,file):
    rel_path=rel_path = os.path.join(os.path.dirname(__file__), f"../backend/{file}")
    JSONfile = open(rel_path, "r")
    data = json.load(JSONfile)
    JSONfile.close()

    filtered_devices = [
    {key: device[key] for key in ["id", "name", "ip"]}
    for device in data["smart_home_devices"]
    
    if device.get("connection_status") == "connected"
    ]

    for i in range(len(filtered_devices)): 
        coll_ref.document().set(filtered_devices[i])

def delete_collection(coll_ref):
    
    count_query = coll_ref.count()
    query_result = count_query.get()
    coll_size=query_result[0][0].value

    if coll_size == 0:
        return

    docs = coll_ref.list_documents(page_size=coll_size)
    deleted = 0

    for doc in docs:
        print(f"Deleting doc {doc.id} => {doc.get().to_dict()}")
        doc.delete()
        deleted = deleted + 1

    if deleted >= coll_size:
        return delete_collection(coll_ref)
    
def is_json_updated(file):
    global LAST_MODIFIED_TIME
    current_modified_time = os.path.getmtime(file)
    if current_modified_time > LAST_MODIFIED_TIME:
        LAST_MODIFIED_TIME = current_modified_time
        return True
    return False

    
delete_collection(db.collection("Devices"))
set_doc_data(db.collection("Devices"),"devices.json")