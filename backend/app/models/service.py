from datetime import datetime

from app.extensions import db


class Service(db.Model):
    __tablename__ = "services"

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
        db.String(100),
        nullable=False,
        unique=False
    )

    description = db.Column(
        db.Text,
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

    facilities = db.relationship(
        "Facility",
        secondary="facility_services",
        back_populates="services"
    )

    owner = db.relationship("User", back_populates="services")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat()
            if self.created_at else None,
            "updated_at": self.updated_at.isoformat()
            if self.updated_at else None,
        }

    def __repr__(self):
        return f"<Service {self.name}>"
