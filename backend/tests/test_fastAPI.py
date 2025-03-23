import pytest
from fastapi.testclient import TestClient
from fastAPI import app  # Import your FastAPI app instance here

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Smart Home API!"}

def test_select_user():
    response = client.post("/select_user/testuser")
    assert response.status_code == 200
    assert "selected_user" in response.json()

if __name__ == "__main__":
    pytest.main()
