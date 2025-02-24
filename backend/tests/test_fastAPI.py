from fastapi.testclient import TestClient
from backend.fastAPI import app
import pytest
import json

client = TestClient(app)

@pytest.fixture
def mock_user_data():
    """Mock user database data"""
    return {
        "users": [
            {
                "user_name": "john_doe",
                "user_password": "securepassword123",
                "allocated_devices": ["Laptop", "Smartphone", "Tablet"],
                "user_privileges": {
                    "admin_access": True,
                    "read_access": True,
                    "write_access": False,
                    "execute_access": True
                }
            },
            {
                "user_name": "jane_smith",
                "user_password": "mypassword456",
                "allocated_devices": ["Desktop", "Smartphone"],
                "user_privileges": {
                    "admin_access": False,
                    "read_access": True,
                    "write_access": True,
                    "execute_access": False
                }
            }
        ]
    }


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Smart Home API!"}

# def test_change_device_name(mocker):
#     mocker.patch(
#         'backend.devices_json.changeDeviceName',
#         return_value={"error": "Error: Can't use the same name for new_name."},
#         autospec=True
#     )
    
#     response = client.post("/device/1/name/new_name")
#     print(response.json())  # Debugging step to see actual output
#     assert response.status_code == 200
#     assert response.json() == {"error": "Error: Can't use the same name for new_name."}

# def test_get_updates(mocker):
#     mock_updates = ["Changed new_name status to on.", "Error: Can't use the same name for new_name."]
#     mocker.patch("backend.devices_json.getUpdates", return_value=mock_updates, autospec=True)
#     response = client.get("/updates")
#     assert response.status_code == 200
#     assert response.json() == {"updates": mock_updates}

def test_get_user_data(mocker, mock_user_data):
    """Test retrieving user data from the API"""
    mocker.patch("backend.fastAPI.USER_DB_PATH", "/mock/path/to/users_db.json")  # Mock file path
    mocker.patch("builtins.open", mocker.mock_open(read_data=json.dumps(mock_user_data)))  # Mock file reading

    response = client.get("/user_data")
    assert response.status_code == 200
    assert response.json() == mock_user_data

def test_user_data_file_not_found(mocker):
    """Test when the JSON file is missing"""
    mocker.patch("backend.fastAPI.USER_DB_PATH", "/mock/path/to/missing_file.json")  # Mock incorrect file path
    mocker.patch("builtins.open", side_effect=FileNotFoundError())  # Simulate missing file

    response = client.get("/user_data")
    assert response.status_code == 200
    assert response.json() == {"error": "User database file not found"}

def test_user_data_invalid_json(mocker):
    """Test when the JSON file is corrupted or invalid"""
    mocker.patch("backend.fastAPI.USER_DB_PATH", "/mock/path/to/invalid.json")  # Mock incorrect file path
    mocker.patch("builtins.open", mocker.mock_open(read_data="{invalid_json}"))  # Simulate bad JSON data
    mocker.patch("json.load", side_effect=json.JSONDecodeError("Expecting value", "invalid.json", 0))  # Mock JSON error

    response = client.get("/user_data")
    assert response.status_code == 200
    assert response.json() == {"error": "Error decoding JSON data"}