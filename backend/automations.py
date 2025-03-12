import asyncio
import json
from datetime import datetime
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

async def automation_scheduler():
    """Continuously checks automations and triggers device status change."""
    while True:
        automations = loadAutomations().get("automations", [])
        current_time = datetime.now().strftime("%H:%M")

        for automation in automations:
            if automation["enabled"] and automation["triggers"] == current_time:
                changeDeviceStatus(automation["device_id"])

        await asyncio.sleep(60)

loadAutomations()