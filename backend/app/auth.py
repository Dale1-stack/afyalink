from functools import wraps

from flask import current_app, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.extensions import db
from app.models import User


def _serializer():
    return URLSafeTimedSerializer(
        current_app.config["SECRET_KEY"],
        salt="afyalink-access-token-v1",
    )


def create_access_token(user):
    return _serializer().dumps({"sub": user.id, "version": user.token_version})


def require_auth(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        scheme, _, token = header.partition(" ")
        if scheme.lower() != "bearer" or not token:
            return jsonify({"error": "Authentication is required"}), 401

        try:
            payload = _serializer().loads(
                token,
                max_age=current_app.config["ACCESS_TOKEN_EXPIRES_SECONDS"],
            )
            user_id = int(payload["sub"])
            token_version = int(payload["version"])
        except (BadSignature, SignatureExpired, KeyError, TypeError, ValueError):
            return jsonify({"error": "Your session is invalid or has expired"}), 401

        user = db.session.get(User, user_id)
        if not user or user.token_version != token_version:
            return jsonify({"error": "Your session is invalid or has expired"}), 401

        g.current_user = user
        return view(*args, **kwargs)

    return wrapped


def current_user():
    return g.current_user


def require_ownership(resource):
    if resource.owner_id != current_user().id:
        return jsonify({"error": "You do not have permission to modify this resource"}), 403
    return None
