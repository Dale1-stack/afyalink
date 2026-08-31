import os
import secrets
from dotenv import load_dotenv

load_dotenv()


class Config:
    ENVIRONMENT = os.getenv("FLASK_ENV", "development").lower()
    # Development gets an ephemeral secret so there is never a shared,
    # hard-coded signing key. Deployments must set SECRET_KEY explicitly.
    SECRET_KEY = os.getenv("SECRET_KEY") or secrets.token_urlsafe(48)
    ACCESS_TOKEN_EXPIRES_SECONDS = int(
        os.getenv("ACCESS_TOKEN_EXPIRES_SECONDS", "3600")
    )
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        ).split(",")
        if origin.strip()
    ]

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
