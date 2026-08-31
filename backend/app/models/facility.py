from datetime import datetime

from sqlalchemy.dialects.postgresql import JSONB
from app.extensions import db


class Facility(db.Model):
    __tablename__ = "facilities"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    owner_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )

    name = db.Column(
        db.String(200),
        nullable=False
    )

    type = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    address = db.Column(
        db.String(255),
        nullable=False
    )

    county = db.Column(
        db.String(100),
        nullable=False
    )

    latitude = db.Column(
        db.Float,
        nullable=False
    )

    longitude = db.Column(
        db.Float,
        nullable=False
    )

    phone = db.Column(
        db.String(50),
        nullable=True
    )

    emergency = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    opening_hours = db.Column(
        JSONB,
        nullable=True
    )

    wheelchair = db.Column(
        db.String(20),
        nullable=True
    )

    operator = db.Column(
        db.String(200),
        nullable=True
    )

    source = db.Column(
        db.String(100),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    services = db.relationship(
        "Service",
        secondary="facility_services",
        back_populates="facilities"
    )

    owner = db.relationship("User", back_populates="facilities")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "address": self.address,
            "county": self.county,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "phone": self.phone,
            "emergency": self.emergency,
            "opening_hours": self.opening_hours,
            "wheelchair": self.wheelchair,
            "operator": self.operator,
            "source": self.source,
            "services": [
                {
                    "id": service.id,
                    "name": service.name,
                    "description": service.description,
                }
                for service in self.services
            ],
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else None
            ),
        }

    def __repr__(self):
        return f"<Facility {self.name}>"
