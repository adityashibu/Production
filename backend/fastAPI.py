from typing import List, Optional
from pydantic import BaseModel

import devices_json as dj
import users
import energy_json as ej

import asyncio
import os
import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Serve user data (Only for testing purposes)
USER_DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "database", "users_db.json")
# print(USER_DB_PATH) # For testing purposes

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRequest(BaseModel):
    user_name: str
    user_password: str
    allocated_devices: Optional[List[str]] = None

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
    jsonData = dj.loadDevicesJSON()
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
    """Returns combined updates from devices and users."""
    device_updates = dj.getUpdates()
    user_updates = users.getUpdates()

    all_updates = device_updates + user_updates

    return {"updates": all_updates}

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

@app.post("/select_user/{user}")
def set_selected_user(user: str):
    """Sets the selected user"""
    return users.select_user(user)

@app.get("/selected_user")
def get_selected_user():
    """Returns the selected user"""
    return users.get_selected_user()

@app.post("/add_user/")
def add_new_user(user: UserRequest):
    """Adds a new user with the given name, password, and optional allocated devices."""
    return users.add_user(user.user_name, user.user_password, user.allocated_devices or [])

@app.delete("/delete_user/{user_name}/{user_password}")
def delete_user(user_name: str, user_password: str):
    """Deletes a user with the given name and password."""
    return users.delete_user(user_name, user_password)

@app.get("/energy_usage")
def fetch_energy_usage(range: str):
    if range == "daily":
        return ej.get_energy_data("daily")
    elif range == "monthly":
        return ej.get_energy_data("monthly")
    else:
        raise HTTPException(status_code=400, detail="Invalid range")
    
@app.get("/energy_usage/{time_range}")
def fetch_energy_usage(time_range: str):
    return ej.get_energy_data(time_range)