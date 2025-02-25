import json
import schedule

automationFile = "automations.json"
updates = [] # For frontend


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