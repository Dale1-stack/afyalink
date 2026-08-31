import os

from flask import Flask, jsonify

from .config import Config
from .extensions import db, migrate, cors

from .models import Facility, Service, FacilityService
from .routes.auth import auth_bp
from .routes.services import services_bp
from .routes.facilities import facilities_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    production_environment = app.config["ENVIRONMENT"] in {"production", "staging"}
    configured_secret = os.getenv("SECRET_KEY", "")
    if production_environment and len(configured_secret) < 32:
        raise RuntimeError(
            "SECRET_KEY must contain at least 32 characters outside development"
        )

    db.init_app(app)
    migrate.init_app(app, db)
    cors(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(services_bp)
    app.register_blueprint(facilities_bp)

    @app.get("/api/health")
    def health_check():
        try:
            db.session.execute(
                db.text("SELECT 1")
            )

            return jsonify({
                "status": "success",
                "message": "AfyaLink API is running",
                "database": "connected"
            }), 200

        except Exception as error:
            return jsonify({
                "status": "error",
                "message": "Database connection failed",
                "error": str(error)
            }), 500

    return app
