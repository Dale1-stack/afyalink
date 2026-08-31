import re

from flask import Blueprint, current_app, jsonify, request

from app.auth import create_access_token, current_user, require_auth
from app.extensions import db
from app.models import User


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _credentials(data):
    if not isinstance(data, dict):
        return None, None, (jsonify({"error": "Request body must contain JSON"}), 400)

    email = data.get("email", "")
    password = data.get("password", "")
    if not isinstance(email, str) or not isinstance(password, str):
        return None, None, (jsonify({"error": "Email and password must be strings"}), 400)

    email = email.strip().lower()
    if len(email) > 254 or not EMAIL_PATTERN.fullmatch(email):
        return None, None, (jsonify({"error": "Enter a valid email address"}), 400)
    return email, password, None


def _auth_response(user, status=200):
    return jsonify({
        "access_token": create_access_token(user),
        "token_type": "Bearer",
        "expires_in": current_app.config["ACCESS_TOKEN_EXPIRES_SECONDS"],
        "user": user.to_dict(),
    }), status


@auth_bp.post("/register")
def register():
    email, password, error = _credentials(request.get_json(silent=True))
    if error:
        return error
    if len(password) < 12:
        return jsonify({"error": "Password must be at least 12 characters"}), 400
    if User.query.filter(db.func.lower(User.email) == email).first():
        return jsonify({"error": "An account with this email already exists"}), 409

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return _auth_response(user, 201)


@auth_bp.post("/login")
def login():
    email, password, error = _credentials(request.get_json(silent=True))
    if error:
        return error
    user = User.query.filter(db.func.lower(User.email) == email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    return _auth_response(user)


@auth_bp.get("/me")
@require_auth
def me():
    return jsonify({"user": current_user().to_dict()}), 200


@auth_bp.post("/logout")
@require_auth
def logout():
    current_user().token_version += 1
    db.session.commit()
    return jsonify({"message": "Logged out successfully"}), 200
