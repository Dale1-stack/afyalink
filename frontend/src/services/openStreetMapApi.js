const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

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

  for (const url of OVERPASS_URLS) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      20000
    );

    try {
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            data: query,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          `OpenStreetMap request failed: ${response.status}`
        );
      }

      return response.json();
    } catch {
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    "Nearby facilities could not be loaded from OpenStreetMap."
  );
};
