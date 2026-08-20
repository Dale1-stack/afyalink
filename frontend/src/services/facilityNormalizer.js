const TYPE_MAP = {
  hospital: "Hospital",
  clinic: "Clinic",
  doctors: "Doctor",
  pharmacy: "Pharmacy",
};

const getCoordinates = (element) => {
  if (
    typeof element.lat === "number" &&
    typeof element.lon === "number"
  ) {
    return {
      latitude: element.lat,
      longitude: element.lon,
    };
  }

  if (element.center) {
    return {
      latitude: element.center.lat,
      longitude: element.center.lon,
    };
  }

  return null;
};

const getFacilityType = (tags = {}) => {
  if (tags.amenity) {
    return (
      TYPE_MAP[tags.amenity] ||
      "Healthcare Facility"
    );
  }

  if (tags.healthcare) {
    return tags.healthcare
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  return "Healthcare Facility";
};

const getServices = (tags = {}) => {
  const services = [];

  if (tags.amenity === "hospital") {
    services.push("Hospital");
  }

  if (tags.amenity === "clinic") {
    services.push("Clinic");
  }

  if (tags.amenity === "pharmacy") {
    services.push("Pharmacy");
  }

  if (tags.amenity === "doctors") {
    services.push("Doctor");
  }

  if (tags.emergency === "yes") {
    services.push("Emergency");
  }

  if (tags.healthcare) {
    services.push(
      tags.healthcare
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )
    );
  }

  if (tags["healthcare:speciality"]) {
    const specialties =
      tags["healthcare:speciality"]
        .split(";")
        .map((item) => item.trim());

    services.push(...specialties);
  }

  return [...new Set(services)];
};

export const normalizeFacility = (element) => {
  const tags = element.tags || {};

  const coordinates =
    getCoordinates(element);

  if (!coordinates) {
    return null;
  }

  return {
    id: `osm-${element.type}-${element.id}`,

    source: "OpenStreetMap",

    osmId: element.id,

    osmType: element.type,

    name:
      tags.name ||
      "Unnamed healthcare facility",

    type: getFacilityType(tags),

    description:
      tags.description ||
      "Healthcare facility listed on OpenStreetMap.",

    address: [
      tags["addr:housenumber"],
      tags["addr:street"],
      tags["addr:suburb"],
      tags["addr:city"],
    ]
      .filter(Boolean)
      .join(", "),

    county:
      tags["addr:county"] ||
      tags["addr:state"] ||
      "",

    latitude:
      coordinates.latitude,

    longitude:
      coordinates.longitude,

    services:
      getServices(tags),

    phone:
      tags.phone ||
      tags["contact:phone"] ||
      null,

    website:
      tags.website ||
      tags["contact:website"] ||
      null,

    openingHours:
      tags.opening_hours ||
      null,

    emergency:
      tags.emergency === "yes",

    operator:
      tags.operator ||
      null,

    wheelchair:
      tags.wheelchair ||
      null,
  };
};

export const normalizeFacilities = (
  elements = []
) => {
  const normalized = elements
    .map(normalizeFacility)
    .filter(Boolean);

  const unique = new Map();

  normalized.forEach((facility) => {
    const key = `${facility.name.toLowerCase()}-${facility.latitude.toFixed(
      5
    )}-${facility.longitude.toFixed(5)}`;

    if (!unique.has(key)) {
      unique.set(key, facility);
    }
  });

  return [...unique.values()];
};