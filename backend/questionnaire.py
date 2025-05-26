"""Questionnaire API for adopter vetting."""
import os
import sqlite3
from flask import Blueprint, request, jsonify

questionnaire_bp = Blueprint("questionnaire", __name__)
DB_PATH = os.path.join(os.path.dirname(__file__), "pet_adoption.db")


@questionnaire_bp.route("/questionnaire", methods=["POST"])
def submit_questionnaire():
    data = request.get_json()
    user_id = data.get("user_id")
    answers = data.get("answers")

    print("Received questionnaire:", data)  # for debugging

    if user_id is None or answers is None:
        return jsonify({"error": "Missing user ID or answers"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO questionnaires (user_id, answers, approved)
            VALUES (?, ?, 0)
        """, (user_id, answers))
        conn.commit()
        conn.close()
        return jsonify({"message": "Questionnaire submitted successfully"}), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500


@questionnaire_bp.route("/questionnaire/<int:user_id>", methods=["PATCH"])
def mark_interested_pet(user_id):
    data = request.get_json()
    pet_id = data.get("pet_id")

    if pet_id is None:
        return jsonify({"error": "Missing pet_id"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            UPDATE questionnaires
            SET interested_pet_id = ?
            WHERE user_id = ? AND approved = 1
        """, (pet_id, user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "Interested pet recorded."}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500


@questionnaire_bp.route("/user/<int:user_id>/questionnaire", methods=["GET"])
def get_user_questionnaire_status(user_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            SELECT approved, interested_pet_id FROM questionnaires
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
        """, (user_id,))
        row = cur.fetchone()
        conn.close()

        if not row:
            return jsonify({"approved": False}), 200

        return jsonify({
            "approved": bool(row[0]),
            "interested_pet_id": row[1]
        }), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500


@questionnaire_bp.route("/questionnaire/all", methods=["GET"])
def get_all_questionnaires():
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            SELECT q.id, q.user_id, u.username, q.answers, q.approved, q.interested_pet_id
            FROM questionnaires q
            JOIN users u ON q.user_id = u.id
        """)
        rows = cur.fetchall()
        conn.close()

        results = []
        for row in rows:
            results.append({
                "id": row[0],
                "user_id": row[1],
                "username": row[2],
                "answers": row[3],
                "approved": bool(row[4]),
                "interested_pet_id": row[5]
            })
        return jsonify(results), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500


@questionnaire_bp.route("/questionnaire/approve/<int:user_id>", methods=["PATCH"])
def approve_questionnaire(user_id):
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            UPDATE questionnaires
            SET approved = 1
            WHERE user_id = ?
        """, (user_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": f"User {user_id} questionnaire approved."}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
