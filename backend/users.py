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

def delete_user(user_name: str, user_password: str):
    """Deletes a user from the system if the given password matches. If deleting the super user, assign the position to the next user"""
    users = load_users()
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
        next_super_user["allocated_devices"] = ["1", "2", "3", "4", "5", "6"]
        message += f" {next_super_user['user_name']} is now the super user."

    save_users(users)
    updates.append(message)
    return {"success": message}

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