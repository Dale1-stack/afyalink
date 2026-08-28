const API_URL =
  import.meta.env.VITE_API_URL;


async function request(
  endpoint,
  options = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
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
  return request("/facilities/");
};


export const getFacilityById = async (
  id
) => {
  return request(
    `/facilities/${id}`
  );
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
      searchOpenStreetMapFacilities,
    } = await import(
      "./openStreetMapApi"
    );

    const {
      normalizeFacilities,
    } = await import(
      "./facilityNormalizer"
    );

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