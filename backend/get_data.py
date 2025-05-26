"""This module handles user registration logic using SQLite."""
import os
import sqlite3
from flask import jsonify

DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")

def handle_user_registration(data):
    """Handles user's registration from JSON request using SQLite."""
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            return jsonify({"error": "Username already exists"}), 400

        cursor.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password)
        )
        conn.commit()
        conn.close()

        return jsonify({"message": f"User {username} registered successfully!"}), 201

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

def handle_user_login(data):
    """Handles user login from JSON request using SQLite."""
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?",
                       (username, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            user_data = {
                "id": user[0],
                "username": user[1],
                "role": user[3]
            }
            return jsonify({"message": "Login successful!", "user": user_data}), 200
        return jsonify({"error": "Invalid username or password"}), 400

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

def get_user_adoptions(user_id):
    """Returns adoptions for a user, joined with pet names."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT adoptions.id, adoptions.pet_id, adoptions.adopted_on, pets.name AS pet_name
            FROM adoptions
            JOIN pets ON adoptions.pet_id = pets.id
            WHERE adoptions.user_id = ?
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()

        adoptions = [
            {
                "id": row[0],
                "pet_id": row[1],
                "adopted_on": row[2],
                "pet_name": row[3]
            } for row in rows
        ]

        return jsonify(adoptions), 200

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
