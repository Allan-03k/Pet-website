"""Pet Adoption API"""
import os
import sqlite3
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

pets_bp = Blueprint("pets", __name__)
DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@pets_bp.route("/pets", methods=["GET"])
def get_all_pets():
    """
    Get all pets
    ---
    tags:
      - Pets
    responses:
      200:
        description: List of pets
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, type, breed, age, adopted, image_path FROM pets")
        rows = cursor.fetchall()
        conn.close()

        pets = []
        for row in rows:
            image_url = (
                f"http://localhost:5001/{row[6]}" if row[6] else None
            )
            pets.append({
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "breed": row[3],
                "age": row[4],
                "adopted": bool(row[5]),
                "image_url": image_url
            })

        return jsonify({"pets": pets}), 200

    except sqlite3.Error as e:
        return jsonify({"pets": [], "error": str(e)}), 200

@pets_bp.route("/pets", methods=["POST"])
def add_pet():
    """
    Add a new pet
    ---
    tags:
      - Pets
    consumes:
      - multipart/form-data
    parameters:
      - name: name
        in: formData
        type: string
        required: true
      - name: type
        in: formData
        type: string
        required: true
      - name: breed
        in: formData
        type: string
        required: false
      - name: age
        in: formData
        type: integer
        required: true
      - name: image
        in: formData
        type: file
        required: false
    responses:
      201:
        description: Pet successfully added
      400:
        description: Invalid input or server error
    """
    try:
        name = request.form["name"]
        pet_type = request.form["type"]
        breed = request.form.get("breed", "")
        age = int(request.form["age"])

        image_file = request.files.get("image")
        image_path = ""

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = f"static/uploads/{filename}"
            image_file.save(os.path.join(UPLOAD_FOLDER, filename))

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO pets (name, type, breed, age, adopted, image_path) VALUES (?, ?, ?, ?, ?, ?)",
            (name, pet_type, breed, age, False, image_path),
        )
        conn.commit()
        conn.close()
        return jsonify({"message": "Pet added successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400

@pets_bp.route("/pets/<int:pet_id>", methods=["GET"])
def get_pet(pet_id):
    """
    Get pet by ID
    ---
    tags:
      - Pets
    parameters:
      - name: pet_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: Pet found
      404:
        description: Pet not found
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, type, breed, age, adopted, image_path FROM pets WHERE id=?", (pet_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            image_url = (
                f"http://localhost:5001/{row[6]}" if row[6] else None
            )
            pet = {
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "breed": row[3],
                "age": row[4],
                "adopted": bool(row[5]),
                "image_url": image_url
            }
            return jsonify(pet), 200
        else:
            return jsonify({"error": "Pet not found"}), 404

    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 400
