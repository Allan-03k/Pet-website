"""This module handles API endpoints for the backend application."""
from flasgger import Swagger
from flask import Flask, request
from get_data import handle_user_registration
from get_pet import get_pet_list
from blueprint import register_blueprints

app = Flask(__name__)
swagger = Swagger(app)

register_blueprints(app)

@app.route('/')
def home():
    """Home route that returns a simple message."""
    return 'Hello, Flask is running!'

@app.route('/pets')
def get_pets():
    """Returns a hardcoded list of pets."""
    return get_pet_list()

@app.route('/users/register', methods=['POST'])
def register_user():
    """Handles user registration from JSON request."""
    data = request.get_json()
    return handle_user_registration(data)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
