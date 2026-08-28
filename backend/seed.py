from app import create_app
from app.extensions import db
from app.models import Service


services = [
    {
        "name": "Emergency",
        "description": "Emergency medical care and urgent treatment."
    },
    {
        "name": "Outpatient",
        "description": "Medical consultation and treatment without hospital admission."
    },
    {
        "name": "Inpatient",
        "description": "Medical care requiring hospital admission."
    },
    {
        "name": "Laboratory",
        "description": "Medical laboratory testing and diagnostic services."
    },
    {
        "name": "Pharmacy",
        "description": "Prescription medicines and other health products."
    },
    {
        "name": "Maternity",
        "description": "Pregnancy, childbirth and postnatal care."
    },
    {
        "name": "Surgery",
        "description": "Surgical procedures and related medical care."
    },
    {
        "name": "Radiology",
        "description": "Medical imaging and diagnostic services."
    },
    {
        "name": "Dental",
        "description": "Dental examination, treatment and oral healthcare."
    },
    {
        "name": "Pediatrics",
        "description": "Medical care for infants, children and adolescents."
    },
    {
        "name": "Specialist Care",
        "description": "Specialist medical consultation and treatment."
    },
    {
        "name": "Ambulance",
        "description": "Emergency and non-emergency patient transportation."
    }
]


def seed_services():
    app = create_app()

    with app.app_context():
        for service_data in services:

            existing_service = Service.query.filter_by(
                name=service_data["name"]
            ).first()

            if existing_service:
                print(
                    f"Skipping existing service: "
                    f"{service_data['name']}"
                )
                continue

            service = Service(
                name=service_data["name"],
                description=service_data["description"]
            )

            db.session.add(service)

        db.session.commit()

        print("Services seeded successfully.")


if __name__ == "__main__":
    seed_services()