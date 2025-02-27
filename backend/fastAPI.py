import devices_json as dj
import asyncio
import os
import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Serve user data (Only for testing purposes)
USER_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "database", "users_db.json")
# print(USER_DB_PATH) # For testing purposes

# FastAPI initialization and routes
app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Starts device updates when the FastAPI server starts."""
    loop = asyncio.get_event_loop()
    loop.create_task(dj.updateDevices())

@app.get("/")
def root():
    return {"message": "Welcome to the Smart Home API!"}

@app.get("/device_info")
def device_info():
    """Returns the current JSON data."""
    jsonData = dj.loadJSON()
    return jsonData

@app.post("/device/{id}/status")
def change_device_status(id: int):
    """Changes the status of a device according to its ID."""
    return dj.changeDeviceStatus(id)

@app.post("/device/{id}/name/{new_name}")
def change_device_name(id: int, new_name: str):
    """Changes the name of a device according to its ID."""
    result = dj.changeDeviceName(id, new_name)
    return result

@app.get("/updates")
def get_updates():
    """Returns the updates list."""
    return {"updates": dj.getUpdates()}

@app.post("/device/{id}/connect")
async def change_connection_status(id: int):
    """Toggle the connection status of a device."""
    result = await dj.changeConnection(id)
    return result

@app.get("/user_data")
def get_user_data():
    """Loads and returns the user data from the JSON file."""
    try:
        with open(USER_DB_PATH, "r") as file:
            user_data = json.load(file)
        return user_data
    except FileNotFoundError:
        return {"error": f"User database file not found"}
    except json.JSONDecodeError:
        return {"error": "Error decoding JSON data"}

@app.get("/device_functions")
def get_device_functions():
    """Returns the list of device functions."""
    return {"functions": dj.deviceFunctions()}