import json
import asyncio
import random

deviceFile = "devices_template.json"

def loadJSON():
    try:
        with open(deviceFile, "r") as JSONfile:
            return json.load(JSONfile)
    except FileNotFoundError:
        print("Error: devices.json not found!")
        return {"smart_home_devices": []}

def saveJSON(data):
    with open(deviceFile, "w") as JSONfile:
        json.dump(data, JSONfile, indent=2)

def randomizeDevice(device):
    if random.random() < 0.2:
        device["status"] = "on" if device["status"] == "off" else "off"

    if device["status"] == "on":
        device["uptime"] += 1

        if "power_usage" in device:
            usualPower = int(device["power_rating"] * 0.75)
            device["power_usage"] = random.randint(usualPower, device["power_rating"])

        if "acTemp" in device:
            device["acTemp"] = random.randint(65, 80)

        if "ovenTemp" in device:
            device["ovenTemp"] = random.randint(180, 300) 

        if "volume" in device:
            device["volume"] = random.randint(0, 100)

        if "battery_level" in device:
            device["battery_level"] = max(0, device["battery_level"] - random.randint(0, 2))

def changeDeviceName(id, newName):
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for device in devices:      
        if device["id"] == id:
            if device["name"] == newName:
                return {"error": "Can't use the same name!"}
            device["name"] = newName
            print("Changed device name to", newName)
            saveJSON(data)
    return {"error": "ID not found!"}
    
async def updateDevices():
    while True:
        data = loadJSON()
        devices = data.get("smart_home_devices", [])

        for device in devices:
            randomizeDevice(device)

        saveJSON(data)
        print("Updated JSON data...\n", json.dumps(data, indent=2))

        await asyncio.sleep(1)

async def main():
    await updateDevices()

if __name__ == "__main__":
    asyncio.run(main())
