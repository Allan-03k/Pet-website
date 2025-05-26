"""This module handles user registration endpoints."""
from flask import Blueprint, request
from get_data import handle_user_registration, handle_user_login

user_bp = Blueprint('user', __name__)

@user_bp.route('/users/register', methods=['POST'])
def register_user():
    """
    Register a new user
    ---
    tags:
      - Users
    consumes:
      - application/json
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: "allan"
            password:
              type: string
              example: "1234"
    responses:
      201:
        description: Registration successful
      400:
        description: Missing required fields
    """
    data = request.get_json()
    return handle_user_registration(data)

@user_bp.route('/users/login', methods=['POST'])
def login_user():
    """
    User login
    ---
    tags:
      - Users
    consumes:
      - application/json
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
              example: "allan"
            password:
              type: string
              example: "1234"
    responses:
      200:
        description: Login successful
      400:
        description: Missing or invalid credentials
    """
    data = request.get_json()
    return handle_user_login(data)
