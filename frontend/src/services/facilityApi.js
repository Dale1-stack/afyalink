import {
  calculateDistance,
} from "../utils/distance";
import { getAccessToken } from "./authApi";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000/api"
).replace(/\/$/, "");


async function request(
  endpoint,
  options = {}
) {
  const accessToken = getAccessToken();
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
      ...options,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The API returned an invalid response. " +
      "Check that VITE_API_URL points to the backend."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}


// ---------------------------------------------------------
// FACILITIES
// ---------------------------------------------------------

export const getFacilities = async () => {
  const facilities = await request(
    "/facilities/"
  );

  if (!Array.isArray(facilities)) {
    throw new Error(
      "The API returned an invalid facilities list."
    );
  }

  return facilities;
};


export const getFacilityById = async (
  id
) => {
  return request(
    `/facilities/${id}`
  );
};

export const getMyFacilities = async () => {
  const facilities = await request("/facilities/mine");
  if (!Array.isArray(facilities)) {
    throw new Error("The API returned an invalid facilities list.");
  }
  return facilities;
};


export const createFacility = async (
  facility
) => {
  return request(
    "/facilities/",
    {
      method: "POST",
      body: JSON.stringify(facility),
    }
  );
};


export const updateFacility = async (
  id,
  facility
) => {
  return request(
    `/facilities/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(facility),
    }
  );
};


export const deleteFacility = async (
  id
) => {
  return request(
    `/facilities/${id}`,
    {
      method: "DELETE",
    }
  );
};


// ---------------------------------------------------------
// SERVICES
// ---------------------------------------------------------

export const getServices = async () => {
  return request(
    "/services/"
  );
};

export const getMyServices = async () => {
  const services = await request("/services/mine");
  if (!Array.isArray(services)) {
    throw new Error("The API returned an invalid services list.");
  }
  return services;
};


export const createService = async (
  service
) => {
  return request(
    "/services/",
    {
      method: "POST",
      body: JSON.stringify(service),
    }
  );
};


export const updateService = async (
  id,
  service
) => {
  return request(
    `/services/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(service),
    }
  );
};


export const deleteService = async (
  id
) => {
  return request(
    `/services/${id}`,
    {
      method: "DELETE",
    }
  );
};


// ---------------------------------------------------------
// FACILITY ↔ SERVICE
// ---------------------------------------------------------

export const addServiceToFacility = async (
  facilityId,
  serviceId
) => {
  return request(
    `/facilities/${facilityId}/services`,
    {
      method: "POST",
      body: JSON.stringify({
        service_id: serviceId,
      }),
    }
  );
};


export const removeServiceFromFacility =
  async (
    facilityId,
    serviceId
  ) => {
    return request(
      `/facilities/${facilityId}/services/${serviceId}`,
      {
        method: "DELETE",
      }
    );
  };


// ---------------------------------------------------------
// OSM — KEEP FOR NEARBY SEARCH
// ---------------------------------------------------------

export const getNearbyFacilities =
  async ({
    latitude,
    longitude,
    radius = 10000,
  }) => {
    const {
      normalizeFacilities,
    } = await import(
      "./facilityNormalizer"
    );

    const query = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      radius: String(radius),
    });

    try {
      const response = await request(
        `/facilities/nearby?${query}`
      );

      return normalizeFacilities(
        response.elements || []
      );
    } catch (error) {
      // A direct lookup keeps nearby search available while a backend
      // deployment is catching up or a proxy request is unavailable.
      console.warn(
        "Nearby API search failed; trying OpenStreetMap directly.",
        error
      );

      try {
        const {
          searchOpenStreetMapFacilities,
        } = await import(
          "./openStreetMapApi"
        );

        const directResponse =
          await searchOpenStreetMapFacilities({
            latitude,
            longitude,
            radius,
          });

        return normalizeFacilities(
          directResponse.elements || []
        );
      } catch (osmError) {
        console.warn(
          "Direct OpenStreetMap search failed; using AfyaLink facilities.",
          osmError
        );

        const facilities = await getFacilities();
        const radiusInKm = radius / 1000;

        return facilities.filter((facility) =>
          Number.isFinite(facility.latitude) &&
          Number.isFinite(facility.longitude) &&
          calculateDistance(
            latitude,
            longitude,
            facility.latitude,
            facility.longitude
          ) <= radiusInKm
        );
      }
    }
  };
