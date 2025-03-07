import json
import os

SELECTED_USER_FILE = "selected_user.json"

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
