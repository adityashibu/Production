import json
import asyncio
from fastapi import FastAPI, Query
import os

deviceFile = "devices.json"

def loadJSON(): # Loads the device JSON file 
    JSONfile = open(deviceFile, "r")
    data = json.load(JSONfile)
    JSONfile.close()
    return data

def saveJSON(data): # Dumps new data into the device JSON file
    JSONfile = open(deviceFile, "w")
    json.dump(data, JSONfile, indent=2)
    JSONfile.close()

def getFieldData(id): # Retrieve the data of a specific field from the JSON file
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for i in devices:
        if i.get("id") == id:
            print("Object found!") # Terminal purposes
            print(i)
            print("\n") # Terminal purposes

            return i # Returns JSON object to be used in the FastAPI endpoint
        
    print("getFieldData Error: Could not find object...\n") # Terminal purposes 
    return {"error": "device not found"}
    

def setFieldData(id, field, value): # Set the data of a specific field in the JSON file
    data = loadJSON()
    devices = data.get("smart_home_devices", [])

    for i in devices:
        if i.get("id") == id:
            i[field] = value
            saveJSON(data)
            print(f"Set {i['name']}'s {field} to {value}\n") # Terminal purposes
            return {"success": "field updated"}

    print("setFieldData Error: Could not find object or field...\n") # Terminal  
    return {"error": "device or field not found"}

async def updateUptime(): # Update the uptime of all enabled devices in the JSON file
    while True:
        data = loadJSON()
        devices = data.get("smart_home_devices", [])

        for i in devices:
            if i.get("status") == "on":
                i["uptime"] += 1
        
        saveJSON(data)
        await asyncio.sleep(1)

def main():
    getFieldData(1)
    setFieldData(3, "status", "off")
    getFieldData(4)
    getFieldData(8) # Should return an error
    setFieldData(4, "volume", 25)


if __name__ == "__main__":
    main()