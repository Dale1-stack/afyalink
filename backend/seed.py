import argparse

from app import create_app
from app.extensions import db
from app.models.facility import Facility
from app.models.service import Service


app = create_app()


# -------------------------------------------------------------------
# SERVICES
# -------------------------------------------------------------------

SERVICES = [
    {
        "name": "Emergency Care",
        "description": "24-hour emergency and urgent medical care.",
    },
    {
        "name": "Outpatient Care",
        "description": "General outpatient consultation and treatment.",
    },
    {
        "name": "Inpatient Care",
        "description": "Admission and inpatient medical care.",
    },
    {
        "name": "Laboratory",
        "description": "Medical laboratory testing and diagnostics.",
    },
    {
        "name": "Pharmacy",
        "description": "Prescription and over-the-counter medicines.",
    },
    {
        "name": "Maternity",
        "description": "Antenatal, delivery and postnatal services.",
    },
    {
        "name": "Radiology",
        "description": "Diagnostic imaging services.",
    },
    {
        "name": "Dental Care",
        "description": "Dental examination and treatment.",
    },
    {
        "name": "Surgery",
        "description": "General and specialist surgical services.",
    },
    {
        "name": "Ambulance",
        "description": "Emergency ambulance and patient transport.",
    },
    {
        "name": "Pediatrics",
        "description": "Medical care for infants, children and adolescents.",
    },
    {
        "name": "Maternal and Child Health",
        "description": "Integrated maternal, newborn and child healthcare.",
    },
]


# -------------------------------------------------------------------
# FACILITIES
# -------------------------------------------------------------------

FACILITIES = [
    {
        "name": "The Nairobi Hospital",
        "type": "Hospital",
        "description": (
            "A major private healthcare facility providing "
            "comprehensive medical and specialist services."
        ),
        "address": "Argwings Kodhek Road, Nairobi",
        "county": "Nairobi",
        "phone": "+254 703 082000",
        "latitude": -1.2921,
        "longitude": 36.8219,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "The Nairobi Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Ambulance",
            "Pediatrics",
        ],
    },
    {
        "name": "Kenyatta National Hospital",
        "type": "National Referral Hospital",
        "description": (
            "Kenya's largest public referral and teaching hospital "
            "providing comprehensive specialist healthcare."
        ),
        "address": "Hospital Road, Nairobi",
        "county": "Nairobi",
        "phone": "+254 20 2726300",
        "latitude": -1.3018,
        "longitude": 36.8073,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "Ministry of Health",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Ambulance",
            "Pediatrics",
        ],
    },
    {
        "name": "M.P. Shah Hospital",
        "type": "Hospital",
        "description": (
            "Private hospital offering general and specialist "
            "medical services in Nairobi."
        ),
        "address": "Shivachi Road, Parklands, Nairobi",
        "county": "Nairobi",
        "phone": "+254 111 000600",
        "latitude": -1.2579,
        "longitude": 36.8196,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "M.P. Shah Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Radiology",
            "Surgery",
            "Pediatrics",
        ],
    },
    {
        "name": "Aga Khan University Hospital",
        "type": "Hospital",
        "description": (
            "A leading private teaching hospital providing "
            "specialist and comprehensive healthcare services."
        ),
        "address": "3rd Parklands Avenue, Nairobi",
        "county": "Nairobi",
        "phone": "+254 366 2020",
        "latitude": -1.257,
        "longitude": 36.8172,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "Aga Khan University Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Pediatrics",
        ],
    },
    {
        "name": "Gertrude's Children's Hospital",
        "type": "Children's Hospital",
        "description": (
            "Specialist pediatric healthcare provider serving "
            "children and adolescents."
        ),
        "address": "Muthaiga Road, Nairobi",
        "county": "Nairobi",
        "phone": "+254 703 044000",
        "latitude": -1.2506,
        "longitude": 36.8298,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "Gertrude's Children's Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Radiology",
            "Surgery",
            "Pediatrics",
        ],
    },
    {
        "name": "Nairobi West Hospital",
        "type": "Hospital",
        "description": (
            "Private hospital providing outpatient, inpatient, "
            "emergency and specialist healthcare."
        ),
        "address": "Gandhi Avenue, Nairobi",
        "county": "Nairobi",
        "phone": "+254 703 072000",
        "latitude": -1.3107,
        "longitude": 36.826,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "Nairobi West Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Ambulance",
        ],
    },
    {
        "name": "Mater Misericordiae Hospital",
        "type": "Hospital",
        "description": (
            "Catholic healthcare facility providing general and "
            "specialist medical services."
        ),
        "address": "Dunga Road, Nairobi",
        "county": "Nairobi",
        "phone": "+254 719 073000",
        "latitude": -1.3025,
        "longitude": 36.8277,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "Mater Misericordiae Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Pediatrics",
        ],
    },
    {
        "name": "Kijabe Mission Hospital",
        "type": "Mission Hospital",
        "description": (
            "Mission hospital providing comprehensive healthcare "
            "and specialist services."
        ),
        "address": "Kijabe, Kiambu County",
        "county": "Kiambu",
        "phone": "+254 709 728000",
        "latitude": -0.934,
        "longitude": 36.573,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "AIC Kijabe Hospital",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Pediatrics",
        ],
    },
    {
        "name": "Moi Teaching and Referral Hospital",
        "type": "Teaching and Referral Hospital",
        "description": (
            "Major public teaching and referral hospital serving "
            "patients across western Kenya."
        ),
        "address": "Nandi Road, Eldoret",
        "county": "Uasin Gishu",
        "phone": "+254 53 2033911",
        "latitude": 0.5143,
        "longitude": 35.2698,
        "opening_hours": {
            "monday": "Open 24 hours",
            "tuesday": "Open 24 hours",
            "wednesday": "Open 24 hours",
            "thursday": "Open 24 hours",
            "friday": "Open 24 hours",
            "saturday": "Open 24 hours",
            "sunday": "Open 24 hours",
        },
        "emergency": True,
        "wheelchair": "yes",
        "operator": "Government of Kenya",
        "source": "AfyaLink",
        "services": [
            "Emergency Care",
            "Outpatient Care",
            "Inpatient Care",
            "Laboratory",
            "Pharmacy",
            "Maternity",
            "Radiology",
            "Surgery",
            "Ambulance",
            "Pediatrics",
        ],
    },
]


# -------------------------------------------------------------------
# SEED SERVICES
# -------------------------------------------------------------------

def seed_services():
    services = {}

    for service_data in SERVICES:
        service = Service.query.filter_by(
            name=service_data["name"]
        ).first()

        if not service:
            service = Service(
                name=service_data["name"],
                description=service_data[
                    "description"
                ],
            )

            db.session.add(service)

        services[
            service_data["name"]
        ] = service

    db.session.flush()

    return services


# -------------------------------------------------------------------
# SEED FACILITIES
# -------------------------------------------------------------------

def seed_facilities(services):
    created = 0
    updated = 0

    for facility_data in FACILITIES:

        service_names = facility_data.pop(
            "services",
            []
        )

        facility = Facility.query.filter_by(
            name=facility_data["name"]
        ).first()

        if not facility:
            facility = Facility(
                **facility_data
            )

            db.session.add(facility)

            created += 1

        else:
            for field, value in facility_data.items():
                setattr(
                    facility,
                    field,
                    value
                )

            updated += 1

        facility.services = [
            services[name]
            for name in service_names
            if name in services
        ]

    db.session.commit()

    return created, updated


# -------------------------------------------------------------------
# MAIN
# -------------------------------------------------------------------

def seed_database(if_empty=False):
    with app.app_context():

        if if_empty and Facility.query.first() is not None:
            print("Database already contains facilities; skipping seed.")
            return

        print(
            "\n🌱 Starting AfyaLink database seed...\n"
        )

        services = seed_services()

        print(
            f"✓ Services ready: {len(services)}"
        )

        created, updated = seed_facilities(
            services
        )

        print(
            f"✓ Facilities created: {created}"
        )

        print(
            f"✓ Facilities updated: {updated}"
        )

        print(
            "\n✓ AfyaLink database seeded successfully."
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Seed the AfyaLink database."
    )
    parser.add_argument(
        "--if-empty",
        action="store_true",
        help="Seed only when no facilities exist.",
    )
    arguments = parser.parse_args()

    seed_database(if_empty=arguments.if_empty)
