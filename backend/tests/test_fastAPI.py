from fastapi.testclient import TestClient
from backend.fastAPI import app
import pytest

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Smart Home API!"}

def test_change_device_name(mocker):
    mocker.patch('backend.devices_json.changeDeviceName', return_value={"error": "Error: Can't use the same name for new_name."})
    response = client.post("/device/1/name/new_name")
    assert response.status_code == 200
    assert response.json() == {"error": "Error: Can't use the same name for new_name."}

# def test_get_updates(mocker):
#     mock_updates = ["Changed new_name status to on.", "Error: Can't use the same name for new_name."]
#     mocker.patch("backend.devices_json.getUpdates", return_value=mock_updates, autospec=True)
#     response = client.get("/updates")
#     assert response.status_code == 200
#     assert response.json() == {"updates": mock_updates}