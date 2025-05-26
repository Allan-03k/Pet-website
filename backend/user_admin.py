"""This file is for user administration endpoints."""
import os
import sqlite3
from flask import Blueprint, request, jsonify

user_admin_bp = Blueprint('user_admin', __name__)

DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")

@user_admin_bp.route('/users', methods=['GET'])
def list_users():
    """
    Get list of users
    ---
    tags:
      - Users
    responses:
      200:
        description: A list of users
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              username:
                type: string
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username FROM users")
        users = [{"id": row[0], "username": row[1]} for row in cursor.fetchall()]
        conn.close()
        return jsonify(users)
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@user_admin_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Get a user by ID
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: User found
      404:
        description: User not found
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return jsonify({"id": row[0], "username": row[1]})
        return jsonify({"error": "User not found"}), 404
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@user_admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Update user info by ID
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
    responses:
      200:
        description: User updated
      404:
        description: User not found
    """
    data = request.get_json()
    username = data.get("username")
    if not username:
        return jsonify({"error": "Missing username"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET username = ? WHERE id = ?", (username, user_id))
        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404
        conn.commit()
        conn.close()
        return jsonify({"message": "User updated"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@user_admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a user by ID
    ---
    tags:
      - Users
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: User deleted
      404:
        description: User not found
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "User not found"}), 404
        conn.commit()
        conn.close()
        return jsonify({"message": "User deleted"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
