"""This file is a blueprint registration module for the Flask application."""
from questionnaire import questionnaire_bp
from pets import pets_bp
from user import user_bp
from pet_detail import pet_detail_bp
from user_admin import user_admin_bp
from adoption import adoptions_bp

def register_blueprints(app):
    """"Register all blueprints to the Flask app."""
    app.register_blueprint(pets_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(pet_detail_bp)
    app.register_blueprint(user_admin_bp)
    app.register_blueprint(adoptions_bp)
    app.register_blueprint(questionnaire_bp)
