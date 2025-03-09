import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SELECTED_USER_FILE = "selected_user.json"
USER_DB_FILE = os.path.abspath(os.path.join(BASE_DIR, "../database/users_db.json"))
DEVICE_DB_FILE = os.path.abspath(os.path.join(BASE_DIR, "../backend/devices.json"))
# print(os.path.abspath(os.path.join(BASE_DIR, "../backend/devices.json")))
updates = []

def load_devices():
    """Load smart home devices data from devices.json."""
    if os.path.exists(DEVICE_DB_FILE):
        with open(DEVICE_DB_FILE, "r") as f:
            try:
                data = json.load(f)
                return [str(device["id"]) for device in data.get("smart_home_devices", [])]
            except json.JSONDecodeError:
                return []


def load_users():
    """Load user data from users_db.json."""
    if os.path.exists(USER_DB_FILE):
        with open(USER_DB_FILE, "r") as f:
            try:
                data = json.load(f)
                print(data)
                return data.get("users", [])
            except json.JSONDecodeError:
                return []
    return []


def save_users(users):
    """Save updated user data back to users_db.json."""
    with open(USER_DB_FILE, "w") as f:
        json.dump({"users": users}, f, indent=4)


def add_user(user_name: str, user_password: str, allocated_device_ids: list = None):
    """Adds a new user with correct role and allocated devices."""
    users = load_users()
    available_devices = load_devices()

    if not users:
        user_role = "super_user"
        allocated_devices = available_devices
    else:
        user_role = "sub_user"
        if allocated_device_ids:
            allocated_devices = [str(device_id) for device_id in allocated_device_ids]
        else:
            allocated_devices = []

    new_user_id = (max(user["user_id"] for user in users) + 1) if users else 1

    new_user = {
        "user_id": new_user_id,
        "user_name": user_name,
        "user_password": user_password,
        "allocated_devices": allocated_devices,
        "user_role": user_role
    }

    users.append(new_user)
    save_users(users)

    message = f"New user added: {user_name} with role {'Super User' if user_role == 'super_user' else 'Sub User'}"
    updates.append(message)

    return {"success": message, "user": new_user}


def delete_user(user_name: str, user_password: str):
    """Deletes a user from the system if the given password matches. If deleting the super user, assign the position to the next user.
       Re-indexes user IDs to maintain sequential order.
    """
    users = load_users()
    available_devices = load_devices()
    user_to_delete = next((u for u in users if u["user_name"] == user_name), None)

    if not user_to_delete:
        updates.append(f"User {user_name} not found.")
        return {"error": f"User {user_name} not found."}

    if user_to_delete["user_password"] != user_password:
        updates.append("Entered password does not match.")
        return {"error": "Entered password does not match."}

    users.remove(user_to_delete)
    message = f"User {user_name} deleted."

    if user_to_delete["user_role"] == "super_user" and users:
        next_super_user = min(users, key=lambda u: u["user_id"])
        next_super_user["user_role"] = "super_user"
        next_super_user["allocated_devices"] = available_devices
        message += f" {next_super_user['user_name']} is now the super user."

    for index, user in enumerate(users, start=1):
        user["user_id"] = index 

    save_users(users)
    updates.append(message)
    return {"success": message}


def select_user(user: str):
    """Set the selected user and persist it along with their role."""
    global selected_user
    selected_user = user

    users = load_users()
    selected_user_data = next((u for u in users if u["user_name"] == selected_user), None)

    if selected_user_data:
        user_role = selected_user_data["user_role"]
    else:
        user_role = "unknown"

    with open(SELECTED_USER_FILE, "w") as f:
        json.dump({"selected_user": selected_user, "user_role": user_role}, f)

    message = f"Logged in as {selected_user}"
    updates.append(message)
    
    return {"success": message, "selected_user": selected_user, "user_role": user_role}


def get_selected_user():
    """Retrieve the currently selected user and their role."""
    global selected_user
    user_role = ""

    if os.path.exists(SELECTED_USER_FILE):
        with open(SELECTED_USER_FILE, "r") as f:
            data = json.load(f)
            selected_user = data.get("selected_user", "")
            user_role = data.get("user_role", "")

    return {"selected_user": selected_user, "user_role": user_role}


## USERS DEVICE MANAGEMENT ##
def create_selected_user_devices_json():
    """Create a JSON file with the selected users allocated devices"""
    selected_user_data = get_selected_user()
    selected_user_name = selected_user_data.get("selected_user")

    if not selected_user_name:
        return {"error": "No user selected."}
    
    users = load_users()
    devices = load_devices(full_details=True)

    selected_user = next((u for u in users if u["user_name"] == selected_user_name), None)

    if not selected_user:
        return {"error": f"User {selected_user_name} not found."}
    
    allocated_device_ids = set(selected_user.get("allocated_devices", []))

    allocated_devices = [device for device in devices if str(device["id"]) in allocated_device_ids]

    if not allocated_devices:
        message = f"No devices allocated to {selected_user_name}."
        updates.append(message)
        return {"error": f"No devices allocated to {selected_user_name}."}
    
    with open(SELECTED_USER_FILE, "w") as f:
        json.dump({"user"})


def getUpdates():
    global updates
    messages = updates[:]
    updates.clear()
    return messages

# DEBUGGING SHIT DONT MIND
# load_users()
# add_user("Aditya S", "0000", [1, 2, 3, 4])