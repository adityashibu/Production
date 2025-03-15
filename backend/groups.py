import json
import os
import devices_json as dj

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
groupsFile = os.path.abspath(os.path.join(BASE_DIR, "../database/groups.json"))
    
def addGroup(name, devices):
    """Add a new group to the JSON file."""
    if not devices:
            return {"error": "No devices selected!"}
        
    if not name:
        return {"error": "No group name provided!"}
    
    with open(groupsFile, "r") as file:
        data = json.load(file)
        groups = data.get("device_groups", [])
        new_id = max([group["id"] for group in groups] + [0]) + 1
        groups.append({
            "id": new_id,
            "name": name,
            "status": "on",
            "devices": devices
        })
        data["groups"] = groups
        
    for device in devices:
        dj.changeDeviceStatus(device, "on")    
        
    with open(groupsFile, "w") as file:
        json.dump(data, file, indent=4)