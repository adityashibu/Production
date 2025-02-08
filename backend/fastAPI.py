import devices_json as dj
import asyncio

from fastapi import FastAPI
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

@app.get("/test")
def test():
    """Returns the current JSON data."""
    jsonData = dj.loadJSON()
    return jsonData