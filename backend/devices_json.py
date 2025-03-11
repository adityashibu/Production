import json
import asyncio
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

deviceFile = "devices.json"
selectedUserFile = "selected_user.json"
usersDBFile = os.path.abspath(os.path.join(BASE_DIR, "../database/users_db.json"))
selectedUserDevicesFile = "selected_user_devices.json"

updates = []  # Stores messages for frontend
last_selected_user = None  # Keeps track of the last selected user

def loadJSON():
    """Creates selected_user_devices.json based on allocated devices of the selected user."""
    try:
        with open(usersDBFile, "r") as users_file:
            users_data = json.load(users_file)

        with open(selectedUserFile, "r") as selected_user_file:
            selected_user_data = json.load(selected_user_file)

        selected_user_name = selected_user_data.get("selected_user")

        # Find the selected user in users_db.json
        selected_user = next((user for user in users_data["users"] if user["user_name"].strip() == selected_user_name.strip()), None)

        if not selected_user:
            updates.append("Error: Selected user not found!")
            print("DEBUG: Selected user not found!")
            return {"smart_home_devices": []}

        allocated_device_ids = set(map(str, selected_user.get("allocated_devices", [])))  # Ensure string conversion

        print(f"DEBUG: Allocated devices for {selected_user_name}: {allocated_device_ids}")

        # Load all devices
        with open(deviceFile, "r") as devices_file:
            devices_data = json.load(devices_file)

        if "smart_home_devices" not in devices_data:
            print("DEBUG: smart_home_devices key missing in devices.json")
            return {"smart_home_devices": []}

        # Filter only the allocated devices
        filtered_devices = [device for device in devices_data["smart_home_devices"] if str(device["id"]) in allocated_device_ids]

        print(f"DEBUG: Filtered devices: {filtered_devices}")

        # Always overwrite selected_user_devices.json
        with open(selectedUserDevicesFile, "w") as selected_devices_file:
            json.dump({"smart_home_devices": filtered_devices}, selected_devices_file, indent=2)

        return {"smart_home_devices": filtered_devices}

    except FileNotFoundError as e:
        updates.append(f"Error: {str(e)}")
        print(f"DEBUG: FileNotFoundError - {str(e)}")


def loadDevicesJSON():
    """Checks if the selected user has changed and updates selected_user_devices.json if necessary."""
    global last_selected_user

    try:
        # Load selected user
        with open(selectedUserFile, "r") as selected_user_file:
            selected_user_data = json.load(selected_user_file)
        
        selected_user_name = selected_user_data.get("selected_user")

        # If the selected user has changed, reload the devices
        if selected_user_name != last_selected_user:
            print("DEBUG: Selected user changed. Reloading devices...")
            loadJSON()  # Refresh selected_user_devices.json
            last_selected_user = selected_user_name  # Update the last tracked user

        # Now load the updated devices
        with open(selectedUserDevicesFile, "r") as JSONfile:
            return json.load(JSONfile)

    except FileNotFoundError:
        updates.append("Error: selected_user_devices.json not found!")
        return {"smart_home_devices": []}

def saveJSON(data):
    with open(selectedUserDevicesFile, "w") as JSONfile:
        json.dump(data, JSONfile, indent=2)

def randomizeDevice(device):
    if device["status"] == "on":
        device["uptime"] += 1
        if "power_usage" in device:
            usualPower = int(device["power_rating"] * 0.75)
            device["power_usage"] = random.randint(usualPower, device["power_rating"])
        else:
            device["power_usage"] = 0
    else:
        device["power_usage"] = 0

    if "acTemp" in device and device["status"] == "on":
        device["acTemp"] = random.randint(65, 80)

    if "ovenTemp" in device and device["status"] == "on":
        device["ovenTemp"] = random.randint(180, 300)

    if "volume" in device and device["status"] == "on":
        device["volume"] = random.randint(0, 100)

    if "battery_level" in device and device["status"] == "on":
        device["battery_level"] = max(0, device["battery_level"] - random.randint(0, 2))

def setTimer(id, time):
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for device in devices:
        if device["id"] == id:
            if "timer" in device and device["timer"] == 0:
                device["timer"] = time
                saveJSON(data)
                message = f"Set timer for {device['name']} to {time} seconds"
                updates.append(message)
                return {"success": message}
            message = f"Error: {device['name']} does not support a timer."
            updates.append(message)
            return {"error": message}
    return {"error": "ID not found!"}

def handleTimer(device):
    if "timer" in device and device["timer"] > 0:
        device["timer"] -= 1
        if device["timer"] == 0:
            device["status"] = "off"
            message = f"Turned off {device['name']} after timer expired."
            updates.append(message)

def changeDeviceName(id, newName):
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for device in devices:
        if device["id"] == id:
            if device["name"] == newName:
                message = f"Error: Can't use the same name for {newName}."
                updates.append(message)
                return {"error": message}
            device["name"] = newName
            saveJSON(data)
            message = f"Changed device name to {newName}."
            updates.append(message)
            return {"success": message}
    return {"error": "ID not found!"}

def changeDeviceStatus(id):
    data = loadDevicesJSON()  # Load from selected_user_devices.json
    devices = data.get("smart_home_devices", [])

    for device in devices:
        if device["id"] == id:
            device["status"] = "on" if device["status"] == "off" else "off"
            saveJSON(data)  # Save the updated data
            message = f"Changed {device['name']} status to {device['status']}."
            updates.append(message)
            return {"success": message}
    return {"error": "ID not found!"}

def sumPower():
    data = loadJSON()
    devices = data.get("smart_home_devices", [])
    return sum(device["power_usage"] for device in devices)

def sumRating():
    data = loadJSON()
    devices = data.get("smart_home_devices", [])
    return sum(device["power_rating"] for device in devices)

def deviceFunctions(): # Returns the list of device functions for scheduling purposes and possibly miscellaneous purposes
    return ["Set Oven Timer", "Change Device Status"]

async def updateDevices():
    while True:
        data = loadDevicesJSON()  # Use the new function
        devices = data.get("smart_home_devices", [])

        for device in devices:
            randomizeDevice(device)
            handleTimer(device)

        saveJSON(data)  # Save back to selected_user_devices.json
        await asyncio.sleep(1)

async def changeConnection(id):
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for device in devices:
        if device["id"] == id:
            device["connection_status"] = (
                "connected" if device["connection_status"] == "not_connected" else "not_connected"
            )

            saveJSON(data)
            message = (
                f"Connected {device['name']}." 
                if device["connection_status"] == "connected" 
                else f"Disconnected {device['name']}."
            )
            updates.append(message)
            return {"success": message}

    return {"error": "ID not found!"}


def getUpdates():
    global updates
    messages = updates[:]
    updates.clear()
    return messages

loadJSON()