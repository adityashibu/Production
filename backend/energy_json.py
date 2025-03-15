import json
import os

ENERGY_FOLDER = os.path.join(os.path.dirname(__file__), "energy")
print(ENERGY_FOLDER)

def get_energy_data(time_range: str):
    """Fetch energy usage data from JSON files."""
    
    if time_range not in ["daily", "monthly"]:
        return {"error": "Invalid time range. Use 'daily' or 'monthly'."}

    file_path = os.path.join(ENERGY_FOLDER, f"{time_range}_energy.json")

    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {"error": f"{time_range}_energy.json not found."}
    except json.JSONDecodeError:
        return {"error": f"Invalid JSON format in {time_range}_energy.json."}
