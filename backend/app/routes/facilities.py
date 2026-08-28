import json
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Facility, Service


facilities_bp = Blueprint(
    "facilities",
    __name__,
    url_prefix="/api/facilities"
)


OVERPASS_URLS = (
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
)
MAX_NEARBY_RADIUS_METERS = 20000


def validate_nearby_query():
    try:
        latitude = float(request.args["latitude"])
        longitude = float(request.args["longitude"])
        radius = int(request.args.get("radius", 10000))
    except (KeyError, TypeError, ValueError):
        return None, jsonify({
            "error": "latitude, longitude, and radius must be valid numbers"
        }), 400

    if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
        return None, jsonify({
            "error": "latitude or longitude is outside its valid range"
        }), 400

    if not 100 <= radius <= MAX_NEARBY_RADIUS_METERS:
        return None, jsonify({
            "error": (
                "radius must be between 100 and "
                f"{MAX_NEARBY_RADIUS_METERS} metres"
            )
        }), 400

    return (latitude, longitude, radius), None, None


def build_overpass_query(latitude, longitude, radius):
    return f"""
        [out:json][timeout:20];
        (
          nwr(around:{radius},{latitude},{longitude})[\"amenity\"=\"hospital\"];
          nwr(around:{radius},{latitude},{longitude})[\"amenity\"=\"clinic\"];
          nwr(around:{radius},{latitude},{longitude})[\"amenity\"=\"doctors\"];
          nwr(around:{radius},{latitude},{longitude})[\"amenity\"=\"pharmacy\"];
          nwr(around:{radius},{latitude},{longitude})[\"healthcare\"];
        );
        out center tags;
    """


@facilities_bp.get("/nearby")
def get_nearby_facilities():
    coordinates, error_response, status = validate_nearby_query()

    if error_response:
        return error_response, status

    latitude, longitude, radius = coordinates
    payload = urlencode({
        "data": build_overpass_query(latitude, longitude, radius)
    }).encode("utf-8")
    for url in OVERPASS_URLS:
        overpass_request = Request(
            url,
            data=payload,
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "AfyaLink/1.0",
            },
            method="POST",
        )

        try:
            with urlopen(overpass_request, timeout=20) as response:
                data = json.loads(response.read().decode("utf-8"))
                return jsonify(data), 200
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError):
            continue

    return jsonify({
        "error": "Nearby facility search is temporarily unavailable"
    }), 503


def validate_facility_data(data, partial=False):
    """
    Validate facility request data.

    Returns:
        tuple:
            (cleaned_data, error_response)
    """

    if not isinstance(data, dict):
        return None, (
            jsonify({
                "error": "Request body must contain JSON"
            }),
            400
        )

    required_fields = [
        "name",
        "type",
        "address",
        "county",
        "latitude",
        "longitude",
    ]

    if not partial:
        missing = [
            field
            for field in required_fields
            if field not in data
        ]

        if missing:
            return None, (
                jsonify({
                    "error": "Missing required fields",
                    "fields": missing
                }),
                400
            )

    cleaned = {}

    if "name" in data:
        if not isinstance(data["name"], str):
            return None, (
                jsonify({
                    "error": "name must be a string"
                }),
                400
            )

        name = data["name"].strip()

        if not name:
            return None, (
                jsonify({
                    "error": "name cannot be empty"
                }),
                400
            )

        cleaned["name"] = name

    if "type" in data:
        if not isinstance(data["type"], str):
            return None, (
                jsonify({
                    "error": "type must be a string"
                }),
                400
            )

        cleaned["type"] = data["type"].strip()

    if "description" in data:
        cleaned["description"] = data["description"]

    if "address" in data:
        cleaned["address"] = data["address"]

    if "county" in data:
        cleaned["county"] = data["county"]

    if "phone" in data:
        cleaned["phone"] = data["phone"]

    if "latitude" in data:
        try:
            cleaned["latitude"] = float(data["latitude"])
        except (TypeError, ValueError):
            return None, (
                jsonify({
                    "error": "latitude must be a number"
                }),
                400
            )

    if "longitude" in data:
        try:
            cleaned["longitude"] = float(data["longitude"])
        except (TypeError, ValueError):
            return None, (
                jsonify({
                    "error": "longitude must be a number"
                }),
                400
            )

    if "emergency" in data:
        if not isinstance(data["emergency"], bool):
            return None, (
                jsonify({
                    "error": "emergency must be true or false"
                }),
                400
            )

        cleaned["emergency"] = data["emergency"]

    if "opening_hours" in data:
        if (
            data["opening_hours"] is not None
            and not isinstance(
                data["opening_hours"],
                dict
            )
        ):
            return None, (
                jsonify({
                    "error": "opening_hours must be a JSON object"
                }),
                400
            )

        cleaned["opening_hours"] = data[
            "opening_hours"
        ]

    if "wheelchair" in data:
        cleaned["wheelchair"] = data["wheelchair"]

    if "operator" in data:
        cleaned["operator"] = data["operator"]

    if "source" in data:
        cleaned["source"] = data["source"]

    return cleaned, None


# ---------------------------------------------------------
# GET ALL FACILITIES
# ---------------------------------------------------------

@facilities_bp.get("/")
def get_facilities():

    facilities = Facility.query.order_by(
        Facility.name.asc()
    ).all()

    return jsonify([
        facility.to_dict()
        for facility in facilities
    ]), 200


# ---------------------------------------------------------
# GET SINGLE FACILITY
# ---------------------------------------------------------

@facilities_bp.get("/<int:facility_id>")
def get_facility(facility_id):

    facility = db.session.get(
        Facility,
        facility_id
    )

    if not facility:
        return jsonify({
            "error": "Facility not found"
        }), 404

    return jsonify(
        facility.to_dict()
    ), 200


# ---------------------------------------------------------
# CREATE FACILITY
# ---------------------------------------------------------

@facilities_bp.post("/")
def create_facility():

    data = request.get_json(silent=True)

    cleaned, error = validate_facility_data(
        data
    )

    if error:
        return error

    existing = Facility.query.filter(
        db.func.lower(Facility.name)
        == cleaned["name"].lower()
    ).first()

    if existing:
        return jsonify({
            "error": "A facility with this name already exists"
        }), 409

    facility = Facility(
        **cleaned
    )

    try:

        db.session.add(facility)
        db.session.commit()

        return jsonify(
            facility.to_dict()
        ), 201

    except Exception as error:

        db.session.rollback()

        return jsonify({
            "error": "Failed to create facility",
            "details": str(error)
        }), 500


# ---------------------------------------------------------
# UPDATE FACILITY
# ---------------------------------------------------------

@facilities_bp.put("/<int:facility_id>")
def update_facility(facility_id):

    facility = db.session.get(
        Facility,
        facility_id
    )

    if not facility:
        return jsonify({
            "error": "Facility not found"
        }), 404

    data = request.get_json(silent=True)

    cleaned, error = validate_facility_data(
        data,
        partial=True
    )

    if error:
        return error

    if "name" in cleaned:

        duplicate = Facility.query.filter(
            db.func.lower(Facility.name)
            == cleaned["name"].lower(),
            Facility.id != facility_id
        ).first()

        if duplicate:
            return jsonify({
                "error": (
                    "Another facility with this "
                    "name already exists"
                )
            }), 409

    for field, value in cleaned.items():
        setattr(
            facility,
            field,
            value
        )

    try:

        db.session.commit()

        return jsonify(
            facility.to_dict()
        ), 200

    except Exception as error:

        db.session.rollback()

        return jsonify({
            "error": "Failed to update facility",
            "details": str(error)
        }), 500


# ---------------------------------------------------------
# DELETE FACILITY
# ---------------------------------------------------------

@facilities_bp.delete("/<int:facility_id>")
def delete_facility(facility_id):

    facility = db.session.get(
        Facility,
        facility_id
    )

    if not facility:
        return jsonify({
            "error": "Facility not found"
        }), 404

    try:

        db.session.delete(facility)
        db.session.commit()

        return jsonify({
            "message": "Facility deleted successfully"
        }), 200

    except Exception as error:

        db.session.rollback()

        return jsonify({
            "error": "Failed to delete facility",
            "details": str(error)
        }), 500


# ---------------------------------------------------------
# ADD SERVICE TO FACILITY
# ---------------------------------------------------------

@facilities_bp.post(
    "/<int:facility_id>/services"
)
def add_service_to_facility(facility_id):

    facility = db.session.get(
        Facility,
        facility_id
    )

    if not facility:
        return jsonify({
            "error": "Facility not found"
        }), 404

    data = request.get_json(silent=True)

    if not data or "service_id" not in data:
        return jsonify({
            "error": "service_id is required"
        }), 400

    try:
        service_id = int(
            data["service_id"]
        )
    except (TypeError, ValueError):
        return jsonify({
            "error": "service_id must be an integer"
        }), 400

    service = db.session.get(
        Service,
        service_id
    )

    if not service:
        return jsonify({
            "error": "Service not found"
        }), 404

    if service in facility.services:
        return jsonify({
            "error": "Service is already assigned"
        }), 409

    try:

        facility.services.append(service)

        db.session.commit()

        return jsonify(
            facility.to_dict()
        ), 200

    except Exception as error:

        db.session.rollback()

        return jsonify({
            "error": "Failed to assign service",
            "details": str(error)
        }), 500


# ---------------------------------------------------------
# REMOVE SERVICE FROM FACILITY
# ---------------------------------------------------------

@facilities_bp.delete(
    "/<int:facility_id>/services/<int:service_id>"
)
def remove_service_from_facility(
    facility_id,
    service_id
):

    facility = db.session.get(
        Facility,
        facility_id
    )

    if not facility:
        return jsonify({
            "error": "Facility not found"
        }), 404

    service = db.session.get(
        Service,
        service_id
    )

    if not service:
        return jsonify({
            "error": "Service not found"
        }), 404

    if service not in facility.services:
        return jsonify({
            "error": "Service is not assigned to this facility"
        }), 404

    try:

        facility.services.remove(service)

        db.session.commit()

        return jsonify(
            facility.to_dict()
        ), 200

    except Exception as error:

        db.session.rollback()

        return jsonify({
            "error": "Failed to remove service",
            "details": str(error)
        }), 500
