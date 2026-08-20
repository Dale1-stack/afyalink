const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

const buildQuery = (latitude, longitude, radius) => `
[out:json][timeout:25];

(
  nwr(around:${radius},${latitude},${longitude})["amenity"="hospital"];
  nwr(around:${radius},${latitude},${longitude})["amenity"="clinic"];
  nwr(around:${radius},${latitude},${longitude})["amenity"="doctors"];
  nwr(around:${radius},${latitude},${longitude})["amenity"="pharmacy"];
  nwr(around:${radius},${latitude},${longitude})["healthcare"];
);

out center tags;
`;

export const searchOpenStreetMapFacilities = async ({
  latitude,
  longitude,
  radius = 10000,
}) => {
  const query = buildQuery(
    latitude,
    longitude,
    radius
  );

  const response = await fetch(
    OVERPASS_URL,
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

  return response.json();
};