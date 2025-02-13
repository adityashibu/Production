import json
import asyncio
import random

deviceFile = "devices.json"

updates = []  # Stores messages for frontend

def loadJSON():
    try:
        with open(deviceFile, "r") as JSONfile:
            return json.load(JSONfile)
    except FileNotFoundError:
        updates.append("Error: devices.json not found!")
        return {"smart_home_devices": []}

def saveJSON(data):
    with open(deviceFile, "w") as JSONfile:
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
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for device in devices:
        if device["id"] == id:
            device["status"] = "on" if device["status"] == "off" else "off"
            saveJSON(data)
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

async def updateDevices():
    while True:
        data = loadJSON()
        devices = data.get("smart_home_devices", [])

        for device in devices:
            randomizeDevice(device)
            handleTimer(device)

        saveJSON(data)

        await asyncio.sleep(1)

def getUpdates():
    global updates
    messages = updates[:]
    updates.clear()
    return messages
