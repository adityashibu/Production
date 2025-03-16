import json
import os
import devices_json as dj

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
usersFile = os.path.abspath(os.path.join(BASE_DIR, "../database/users_db.json"))
selectedUserFile = os.path.abspath(os.path.join(BASE_DIR, "../backend/selected_user.json"))

def get_selected_user():
    """Fetch the selected user from selected_user.json"""
    with open(selectedUserFile, "r") as file:
        selected_data = json.load(file)
        return selected_data.get("selected_user")


def load_users():
    """Load users from users_db.json"""
    with open(usersFile, "r") as file:
        return json.load(file)


def save_users(data):
    """Save updated user data back to users_db.json"""
    with open(usersFile, "w") as file:
        json.dump(data, file, indent=4)


def addGroup(name, devices):
    """Add a new group to the selected user's groups"""
    if not devices:
        return {"error": "No devices selected!"}

    if not name:
        return {"error": "No group name provided!"}

    selected_user = get_selected_user()
    users_data = load_users()
    user = next((u for u in users_data["users"] if u["user_name"] == selected_user), None)

    if not user:
        return {"error": "Selected user not found!"}

    groups = user.get("device_groups", [])
    if any(group["name"] == name for group in groups):
        return {"error": "Group name already exists!"}

    new_id = max([group["id"] for group in groups] + [0]) + 1
    groups.append({
        "id": new_id,
        "name": name,
        "status": "on",
        "devices": devices
    })
    user["device_groups"] = groups

    for device in devices:
        dj.changeDeviceStatus(device, "on")

    save_users(users_data)
    return {"success": "Group added successfully!"}


def deleteGroup(group_id):
    """Delete a group from the selected user's groups"""
    selected_user = get_selected_user()
    users_data = load_users()
    user = next((u for u in users_data["users"] if u["user_name"] == selected_user), None)

    if not user:
        return {"error": "Selected user not found!"}

    groups = user.get("device_groups", [])
    group = next((g for g in groups if g["id"] == group_id), None)

    if not group:
        return {"error": "Group not found!"}

    groups.remove(group)
    user["device_groups"] = groups

    save_users(users_data)
    return {"success": "Group deleted successfully!"}


def editGroup(group_id, name=None, devices=None, status=None):
    """Edit an existing group by overwriting its details."""
    selected_user = get_selected_user()
    users_data = load_users()
    user = next((u for u in users_data["users"] if u["user_name"] == selected_user), None)

    if not user:
        return {"error": "Selected user not found!"}

    groups = user.get("device_groups", [])
    group = next((g for g in groups if g["id"] == group_id), None)

    if not group:
        return {"error": "Group not found!"}

    if name:
        group["name"] = name
    if status:
        group["status"] = status
        for device in group["devices"]:
            dj.changeDeviceStatus(device, status)
    if devices is not None:
        group["devices"] = devices

    save_users(users_data)
    return {"success": "Group updated successfully!"}


def changeGroupStatus(group_id, status):
    """Change the status of a group"""
    selected_user = get_selected_user()
    users_data = load_users()
    user = next((u for u in users_data["users"] if u["user_name"] == selected_user), None)

    if not user:
        return {"error": "Selected user not found!"}

    groups = user.get("device_groups", [])
    group = next((g for g in groups if g["id"] == group_id), None)

    if not group:
        return {"error": "Group not found!"}

    group["status"] = status

    for device in group["devices"]:
        dj.changeDeviceStatus(device, status)

    save_users(users_data)
    return {"success": "Group status changed successfully!"}


def getGroupsForSelectedUser():
    """Retrieve all groups associated with the selected user."""
    selected_user = get_selected_user()
    users_data = load_users()
    user = next((u for u in users_data["users"] if u["user_name"] == selected_user), None)

    if not user:
        return {"error": "Selected user not found!"}

    result = {"device_groups": user.get("device_groups", [])}
    # print(result)
    return result

# getGroupsForSelectedUser()

# DEBUGGING SHI #
# deleteGroup(2)