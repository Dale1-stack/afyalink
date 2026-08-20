import {
  facilities as fallbackFacilities,
} from "../data/facilities";

import {
  searchOpenStreetMapFacilities,
} from "./openStreetMapApi";

import {
  normalizeFacilities,
} from "./facilityNormalizer";

export const getFacilities = async () => {
  return fallbackFacilities;
};

export const getNearbyFacilities = async ({
  latitude,
  longitude,
  radius = 10000,
}) => {
  try {
    const response =
      await searchOpenStreetMapFacilities({
        latitude,
        longitude,
        radius,
      });

    return normalizeFacilities(
      response.elements
    );
  } catch (error) {
    console.error(
      "OSM facility search failed:",
      error
    );

    return [];
  }
};

export const getFacilityById = async (id) => {
  /*
   * First check our local/sample facilities.
   */
  const localFacility =
    fallbackFacilities.find(
      (facility) =>
        String(facility.id) === String(id)
    );

  if (localFacility) {
    return localFacility;
  }

  /*
   * Handle OpenStreetMap IDs.
   *
   * Example:
   * osm-node-123456
   * osm-way-123456
   * osm-relation-123456
   */
  const osmMatch = String(id).match(
    /^osm-(node|way|relation)-(\d+)$/
  );

  if (!osmMatch) {
    return null;
  }

  const [, osmType, osmId] = osmMatch;

  const query = `
    [out:json][timeout:25];

    ${osmType}(${osmId});

    out center tags;
  `;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          data: query,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Overpass request failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    const normalized =
      normalizeFacilities(
        data.elements
      );

    return (
      normalized.find(
        (facility) =>
          String(facility.osmId) ===
            String(osmId) &&
          facility.osmType === osmType
      ) || null
    );
  } catch (error) {
    console.error(
      "Failed to retrieve OSM facility:",
      error
    );

    return null;
  }
};