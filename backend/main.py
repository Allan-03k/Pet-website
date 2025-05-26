"""Main entry point for the Flask application."""
from flasgger import Swagger
from flask import Flask
from blueprint import register_blueprints
from flask_cors import CORS

app = Flask(__name__)
swagger = Swagger(app)

CORS(app)

register_blueprints(app)


@app.route('/')
def home():
    """Home route that returns a simple message."""
    return 'Hello, Flask is running!'
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
