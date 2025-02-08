import devices_json as dj
import asyncio

from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

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

# The Pydantic model for the request body
class DeviceNameUpdate(BaseModel):
    new_name: str

@app.post("/device/{id}/name")
def change_device_name(id: int, payload: DeviceNameUpdate):
    """Changes the name of a device according to its ID."""
    result = dj.changeDeviceName(id, payload.new_name)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["Failed to rename the device. Please try again"])
    return result