import asyncio
import json
from datetime import datetime, timedelta
from devices_json import changeDeviceStatus, loadDevicesJSON

AUTOMATION_FILE = "automations.json"

def loadAutomations():
    """Load automation rules from JSON and ensure correct types."""
    try:
        with open(AUTOMATION_FILE, "r") as file:
            data = json.load(file)
            for automation in data.get("automations", []):
                automation["device_id"] = int(automation["device_id"])
            return data
    except (FileNotFoundError, json.JSONDecodeError):
        print("No automation file found or invalid JSON, returning empty list.")
        return {"automations": []}
    
def updateAutomationStatus(automation_id, status):
    """Update the 'enabled' status of an automation by ID."""
    try:
        with open(AUTOMATION_FILE, "r") as file:
            data = json.load(file)
        
        for automation in data.get("automations", []):
            if automation["id"] == automation_id:
                automation["enabled"] = status
                break

        with open(AUTOMATION_FILE, "w") as file:
            json.dump(data, file, indent=4)

        print(f"Automation {automation_id} enabled status updated to {status}.")
    except (FileNotFoundError, json.JSONDecodeError):
        print("Failed to update automation status.")

def addAutomation(name, device_id, trigger_time, status):
    """Add a new automation rule to the JSON file."""
    try:
        with open(AUTOMATION_FILE, "r") as file:
            data = json.load(file)
            automations = data.get("automations", [])
            new_id = max([automation["id"] for automation in automations] + [0]) + 1
            automations.append({
                "id": new_id,
                "name": name,
                "device_id": device_id,
                "triggers": trigger_time,
                "enabled": status
            })
            data["automations"] = automations

        with open(AUTOMATION_FILE, "w") as file:
            json.dump(data, file, indent=4)

        print(f"New automation rule added: {name} at {trigger_time}.")
    except (FileNotFoundError, json.JSONDecodeError):
        print("Failed to add new automation rule.")

def deleteAutomation(automation_id):
    """Delete an automation rule from the JSON file based on its ID."""
    try:
        with open(AUTOMATION_FILE, "r") as file:
            data = json.load(file)
            automations = data.get("automations", [])
        
        automations = [automation for automation in automations if automation["id"] != automation_id]

        data["automations"] = automations

        with open(AUTOMATION_FILE, "w") as file:
            json.dump(data, file, indent=4)

        print(f"Automation {automation_id} has been deleted.")
    except (FileNotFoundError, json.JSONDecodeError):
        print("Failed to delete automation rule.")

def editAutomation(automation_id, name, device_id, trigger_time, status):
    """Edit an existing automation rule by ID, overwriting its values."""
    try:
        with open(AUTOMATION_FILE, "r") as file:
            data = json.load(file)
            automations = data.get("automations", [])

        for automation in automations:
            if automation["id"] == automation_id:
                automation["name"] = name
                automation["device_id"] = device_id
                automation["triggers"] = trigger_time
                automation["enabled"] = status
                break
        else:
            print(f"Automation with ID {automation_id} not found.")
            return

        with open(AUTOMATION_FILE, "w") as file:
            json.dump(data, file, indent=4)

        print(f"Automation {automation_id} has been updated successfully.")
    except (FileNotFoundError, json.JSONDecodeError):
        print("Failed to update automation rule.")

async def automation_scheduler():
    """Continuously checks automations and triggers device status change at the exact start of each minute."""
    while True:
        current_time = datetime.now().strftime("%H:%M")
        automations = loadAutomations().get("automations", [])

        for automation in automations:
            if automation["enabled"] and automation["triggers"] == current_time:
                changeDeviceStatus(automation["device_id"])

        now = datetime.now()
        next_minute = (now + timedelta(minutes=1)).replace(second=0, microsecond=0)
        sleep_time = (next_minute - now).total_seconds()

        await asyncio.sleep(sleep_time)
