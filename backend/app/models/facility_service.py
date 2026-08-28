from app.extensions import db


class FacilityService(db.Model):
    __tablename__ = "facility_services"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    facility_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "facilities.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    service_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "services.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    __table_args__ = (
        db.UniqueConstraint(
            "facility_id",
            "service_id",
            name="unique_facility_service"
        ),
    )