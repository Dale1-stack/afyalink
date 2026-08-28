from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Service


services_bp = Blueprint(
    "services",
    __name__,
    url_prefix="/api/services"
)


@services_bp.get("/")
def get_services():
    """
    Get all healthcare services.
    """

    services = Service.query.order_by(
        Service.name.asc()
    ).all()

    return jsonify([
        service.to_dict()
        for service in services
    ]), 200


@services_bp.get("/<int:service_id>")
def get_service(service_id):
    """
    Get a single healthcare service.
    """

    service = db.session.get(
        Service,
        service_id
    )

    if not service:
        return jsonify({
            "error": "Service not found"
        }), 404

    return jsonify(
        service.to_dict()
    ), 200


@services_bp.post("/")
def create_service():
    """
    Create a new healthcare service.
    """

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request body must contain JSON"
        }), 400

    name = data.get("name")

    if not name:
        return jsonify({
            "error": "Service name is required"
        }), 400

    name = name.strip()

    if not name:
        return jsonify({
            "error": "Service name cannot be empty"
        }), 400

    existing_service = Service.query.filter(
        db.func.lower(Service.name) == name.lower()
    ).first()

    if existing_service:
        return jsonify({
            "error": "A service with this name already exists"
        }), 409

    service = Service(
        name=name,
        description=data.get("description")
    )

    try:
        db.session.add(service)
        db.session.commit()

        return jsonify(
            service.to_dict()
        ), 201

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "error": "Failed to create service",
            "details": str(error)
        }), 500


@services_bp.put("/<int:service_id>")
def update_service(service_id):
    """
    Update an existing healthcare service.
    """

    service = db.session.get(
        Service,
        service_id
    )

    if not service:
        return jsonify({
            "error": "Service not found"
        }), 404

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request body must contain JSON"
        }), 400

    if "name" in data:

        name = data["name"]

        if not isinstance(name, str):
            return jsonify({
                "error": "Service name must be a string"
            }), 400

        name = name.strip()

        if not name:
            return jsonify({
                "error": "Service name cannot be empty"
            }), 400

        duplicate = Service.query.filter(
            db.func.lower(Service.name) == name.lower(),
            Service.id != service_id
        ).first()

        if duplicate:
            return jsonify({
                "error": "A service with this name already exists"
            }), 409

        service.name = name

    if "description" in data:
        service.description = data["description"]

    try:
        db.session.commit()

        return jsonify(
            service.to_dict()
        ), 200

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "error": "Failed to update service",
            "details": str(error)
        }), 500


@services_bp.delete("/<int:service_id>")
def delete_service(service_id):
    """
    Delete a healthcare service.
    """

    service = db.session.get(
        Service,
        service_id
    )

    if not service:
        return jsonify({
            "error": "Service not found"
        }), 404

    try:
        db.session.delete(service)
        db.session.commit()

        return jsonify({
            "message": "Service deleted successfully"
        }), 200

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "error": "Failed to delete service",
            "details": str(error)
        }), 500