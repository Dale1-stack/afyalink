# 🏥 AfyaLink

### Healthcare Facility & Service Finder for Kenya

AfyaLink is a web-based healthcare discovery platform designed to make it easier for people to find healthcare facilities and services based on their location and healthcare needs.

The platform helps users discover hospitals, clinics, pharmacies, laboratories, maternity facilities, emergency services and other healthcare providers through an interactive map and searchable facility directory.

> **Project Status:** Phase 1 — MVP / Active Development

---

## 📌 Problem

Finding the right healthcare facility can be difficult, particularly when a person does not know:

- Which facilities are nearby
- Which facility provides a specific service
- Whether a facility is open
- Where the facility is located
- How far away the facility is
- How to contact the facility
- How to get directions

AfyaLink aims to solve this problem by bringing healthcare facility information into a single, easy-to-use platform.

---

# 🎯 Project Objectives

AfyaLink aims to:

- Make healthcare facilities easier to discover
- Help users find facilities near their current location
- Allow users to search by facility name or service
- Provide interactive map-based healthcare discovery
- Display useful facility information
- Connect users to facility directions and contact information
- Build a foundation for a larger healthcare technology platform

---

# 🚀 Phase 1 — MVP

The first phase focuses on healthcare facility discovery.

## Current Features

### 🔎 Facility Search

Users can search for healthcare facilities by:

- Facility name
- Location
- Healthcare service
- Facility type

---

### 📍 Nearby Facilities

AfyaLink can use the user's browser location to identify nearby healthcare facilities.

The system calculates approximate distance between the user's location and healthcare facilities.

---

### 🗺️ Interactive Map

The application provides an interactive map for discovering healthcare facilities.

The map uses:

- OpenStreetMap
- Leaflet
- React Leaflet

Users can:

- View healthcare facilities on a map
- Explore facility locations
- Select facilities
- Open facility details
- Navigate to facilities

---

### 🏥 Facility Details

Each facility can have a dedicated details page containing information such as:

- Facility name
- Facility type
- Address
- Phone number
- Website
- Healthcare services
- Opening hours
- Emergency services
- Wheelchair accessibility
- Operator
- Coordinates
- Data source

---

### 🧭 Directions

Users can open a facility's location in Google Maps to obtain directions.

---

### 🌍 OpenStreetMap Integration

AfyaLink integrates with OpenStreetMap data to discover healthcare facilities.

The project currently uses OSM/Overpass data for facility discovery.

OpenStreetMap data can include facilities such as:

- Hospitals
- Clinics
- Pharmacies
- Laboratories
- Doctors
- Maternity facilities
- Emergency facilities

---

# 🖥️ Application Pages

The current frontend includes:

```text
/
│
├── Home
│
├── Facilities
│   ├── Search
│   ├── Filtering
│   └── Facility listing
│
├── Map
│   └── Interactive healthcare map
│
├── Services
│   └── Healthcare service categories
│
└── Facility Details
    ├── Contact information
    ├── Services
    ├── Opening information
    ├── Location
    └── Directions
