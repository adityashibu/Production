import devices_json as dj
import schedule

automationFile = "automations.json"

import json
import schedule

automationFile = "automations.json"
updates = []


def loadAutomations():
    try:
        with open(automationFile, "r") as JSONfile:
            return json.load(JSONfile)
    except FileNotFoundError:
        updates.append("Error: automations.json not found!")
        return {"automations": []}
    

def saveAutomations(data):
    with open(automationFile, "w") as JSONfile:
        json.dump(data, JSONfile, indent=2)


def addAutomation(automation): # Add automation to automations.json
    data = loadAutomations()
    automations = data.get("automations", [])
    automations.append(automation)
    saveAutomations(data)
    updates.append(f"Added {automation['name']} to the automation table!")


# Manipulation of automation schedules down below
def changeAutomationStatus(id):
    data = loadAutomations()
    automations = data.get("automations", [])
    for automation in automations:
        if automation["id"] == id:
            automation["enabled"] = not automation["enabled"]
            saveAutomations(data)
            updates.append(f"Changed status of {automation['name']} to {automation['enabled']}!")
            return
    updates.append("Error: Automation with specified ID not found (backend error!)")
    return

def deleteAutomation(id):
    data = loadAutomations()
    automations = data.get("automations", [])
    for automation in automations:
        if automation["id"] == id:
            automations.remove(automation)
            saveAutomations(data)
            updates.append(f"Deleted {automation['name']} from the automation table!")
            return
    updates.append("Error: Automation with specified ID not found (backend error!)")
    return
