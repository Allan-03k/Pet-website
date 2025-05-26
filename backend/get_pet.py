"""This file contains a function to retrieve a list of available pets."""
import os
import sqlite3
from flask import jsonify


DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")

def get_pet_list():
    """Fetches all pets from the database and returns them as JSON."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, type, breed, age, adopted FROM pets")
        rows = cursor.fetchall()
        conn.close()

        pets = [
            {
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "breed": row[3],
                "age": row[4],
                "adopted": bool(row[5])
            }
            for row in rows
        ]

        return jsonify({"pets": pets})

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
