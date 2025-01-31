import json
import asyncio
import random
import os

deviceFile = "devices.json"

def loadJSON():
    """Loads the device JSON file"""
    try:
        with open(deviceFile, "r") as JSONfile:
            return json.load(JSONfile)
    except FileNotFoundError:
        print("Error: devices.json not found!")
        return {"smart_home_devices": []}

def saveJSON(data):
    """Dumps updated data into the device JSON file"""
    with open(deviceFile, "w") as JSONfile:
        json.dump(data, JSONfile, indent=2)

def randomize_device(device):
    """Randomly updates device attributes"""
    # Randomly toggle status
    if random.random() < 0.2:  # 20% chance to toggle on/off
        device["status"] = "on" if device["status"] == "off" else "off"

    # If device is ON, increase uptime and adjust values
    if device["status"] == "on":
        device["uptime"] += 1

        if "power_usage" in device:
            device["power_usage"] = random.randint(5, 200)  # Random power usage

        if "temperature" in device:
            device["temperature"] = random.randint(65, 80)  # Random temp (°F)

        if "volume" in device:
            device["volume"] = random.randint(0, 100)  # Random volume

        if "battery_level" in device:
            device["battery_level"] = max(0, device["battery_level"] - random.randint(0, 2))  # Decrease battery level

async def updateDevices():
    """Continuously updates the smart home devices every second"""
    while True:
        data = loadJSON()
        devices = data.get("smart_home_devices", [])

        for device in devices:
            randomize_device(device)

        saveJSON(data)
        print("Updated JSON data...\n", json.dumps(data, indent=2))

        await asyncio.sleep(1)  # Wait for 1 second before next update

async def main():
    """Runs the device update loop"""
    await updateDevices()

if __name__ == "__main__":
    asyncio.run(main())
