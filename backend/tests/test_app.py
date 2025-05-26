import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
import json
from backend.main import app

def test_get_pets():
    """Test the /pets endpoint."""
    with app.test_client() as client:
        response = client.get('/pets')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert "pets" in data
        assert len(data["pets"]) == 3

def test_register_user():
    """Test the /users/register endpoint."""
    test_username = "jackhao"
    with app.test_client() as client:
        response = client.post('/users/register', json={
            "username": test_username,
            "password": "123456"
        })
        data = json.loads(response.data)
        assert response.status_code == 201
        assert "message" in data
        assert data["message"] == f"User {test_username} registered successfully!"
