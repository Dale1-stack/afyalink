from flask import Flask, jsonify

from .config import Config
from .extensions import db, migrate, cors

from .models import Facility, Service, FacilityService
from .routes.services import services_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(services_bp)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors(app)

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