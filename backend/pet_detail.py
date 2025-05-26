"""This file is for pet detail endpoints."""
import os
import sqlite3
from flask import Blueprint, jsonify


pet_detail_bp = Blueprint('pet_detail', __name__, url_prefix='/pets')

DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")

@pet_detail_bp.route('/<int:pet_id>', methods=['GET'])
def get_pet_detail(pet_id):
    """
    Get details of a specific pet
    ---
    tags:
      - Pets
    parameters:
      - in: path
        name: pet_id
        required: true
        type: integer
        description: ID of the pet
    responses:
      200:
        description: Pet details found
      404:
        description: Pet not found
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, type, breed, age, adopted FROM pets WHERE id = ?",
                        (pet_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            pet = {
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "breed": row[3],
                "age": row[4],
                "adopted": bool(row[5])
            }
            return jsonify(pet)
        return jsonify({"error": "Pet not found"}), 404

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
