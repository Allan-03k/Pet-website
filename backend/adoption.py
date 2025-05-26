"""Adoption Management API for pet adoption platform."""
import os
import sqlite3
from flask import Blueprint, request, jsonify

adoptions_bp = Blueprint("adoptions", __name__)
DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")

@adoptions_bp.route("/adoptions", methods=["POST"])
def create_adoption():
    """
    Create a new adoption record
    ---
    tags:
      - Adoptions
    consumes:
      - application/json
    parameters:
      - in: body
        name: adoption
        required: true
        schema:
          type: object
          required:
            - user_id
            - pet_id
          properties:
            user_id:
              type: integer
              example: 1
            pet_id:
              type: integer
              example: 2
    responses:
      201:
        description: Adoption created
      400:
        description: Validation or logic error
    """
    data = request.get_json()
    user_id = data.get("user_id")
    pet_id = data.get("pet_id")

    if not user_id or not pet_id:
        return jsonify({"error": "Missing user_id or pet_id"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        cur.execute("SELECT adopted FROM pets WHERE id = ?", (pet_id,))
        pet = cur.fetchone()
        if not pet:
            return jsonify({"error": "Pet not found"}), 404
        if pet[0] == 1:
            return jsonify({"error": "This pet has already been adopted"}), 400

        cur.execute("INSERT INTO adoptions (user_id, pet_id) VALUES (?, ?)", (user_id, pet_id))
        cur.execute("UPDATE pets SET adopted = 1 WHERE id = ?", (pet_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Adoption successful"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@adoptions_bp.route("/adoptions", methods=["GET"])
def list_adoptions():
    """
    Get all adoption records
    ---
    tags:
      - Adoptions
    responses:
      200:
        description: A list of all adoptions
        schema:
          type: array
          items:
            type: object
            properties:
              id: {type: integer}
              user_id: {type: integer}
              pet_id: {type: integer}
              adopted_on: {type: string}
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT id, user_id, pet_id, adopted_on FROM adoptions")
        rows = cur.fetchall()
        conn.close()

        adoptions = [
            {
                "id": row[0],
                "user_id": row[1],
                "pet_id": row[2],
                "adopted_on": row[3]
            }
            for row in rows
        ]
        return jsonify(adoptions)
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@adoptions_bp.route("/adoptions/<int:user_id>", methods=["GET"])
def get_user_adoptions(user_id):
    """
    Get adoptions by user ID
    ---
    tags:
      - Adoptions
    parameters:
      - in: path
        name: user_id
        required: true
        type: integer
    responses:
      200:
        description: A list of the user's adoptions
        schema:
          type: array
          items:
            type: object
            properties:
              id: {type: integer}
              pet_id: {type: integer}
              adopted_on: {type: string}
              pet_name: {type: string}
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            SELECT adoptions.id, adoptions.pet_id, adoptions.adopted_on, pets.name AS pet_name
            FROM adoptions
            JOIN pets ON adoptions.pet_id = pets.id
            WHERE adoptions.user_id = ?
        """, (user_id,))
        rows = cur.fetchall()
        conn.close()

        adoptions = [
            {
                "id": row[0],
                "pet_id": row[1],
                "adopted_on": row[2],
                "pet_name": row[3]
            }
            for row in rows
        ]
        return jsonify(adoptions)
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500

@adoptions_bp.route("/adoptions/<int:adoption_id>", methods=["DELETE"])
def delete_adoption(adoption_id):
    """
    Delete an adoption by ID
    ---
    tags:
      - Adoptions
    parameters:
      - in: path
        name: adoption_id
        required: true
        type: integer
    responses:
      200:
        description: Adoption deleted
      404:
        description: Adoption not found
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()

        cur.execute("SELECT pet_id FROM adoptions WHERE id = ?", (adoption_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Adoption not found"}), 404

        pet_id = row[0]
        cur.execute("DELETE FROM adoptions WHERE id = ?", (adoption_id,))
        cur.execute("UPDATE pets SET adopted = 0 WHERE id = ?", (pet_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Adoption deleted"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
