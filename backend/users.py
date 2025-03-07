import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get current script directory
SELECTED_USER_FILE = "selected_user.json"
# print(os.path.abspath(os.path.join(BASE_DIR, "../database/users_db.json")))
USER_DB_FILE = os.path.abspath(os.path.join(BASE_DIR, "../database/users_db.json"))
updates = []

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

def add_user(user_name: str, user_password: str):
    """Adds a new user with correct role and allocated devices."""
    users = load_users()

    if not users:
        user_role = "super_user"
        allocated_devices = ["1", "2", "3", "4", "5", "6"]
    else:
        user_role = "sub_user"
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

    message = f"New user added: {user_name} ({user_role})"
    updates.append(message)

    return {"success": message, "user": new_user}

def select_user(user: str):
    """Set the selected user and persist it."""
    global selected_user
    selected_user = user
    with open(SELECTED_USER_FILE, "w") as f:
        json.dump({"selected_user": selected_user}, f)
    message = f"Logged in as {selected_user}"
    updates.append(message)
    return {"success": message}

def get_selected_user():
    """Retrieve the currently selected user."""
    global selected_user
    if os.path.exists(SELECTED_USER_FILE):
        with open(SELECTED_USER_FILE, "r") as f:
            data = json.load(f)
            selected_user = data.get("selected_user", "")
    return {"selected_user": selected_user}

def getUpdates():
    global updates
    messages = updates[:]
    updates.clear()
    return messages

# DEBUGGING SHIT DONT MIND
# load_users()