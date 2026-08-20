const EARTH_RADIUS_KM = 6371;

export const calculateDistance = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const lat1 =
    (latitude1 * Math.PI) / 180;

  const lat2 =
    (latitude2 * Math.PI) / 180;

  const deltaLat =
    ((latitude2 - latitude1) * Math.PI) /
    180;

  const deltaLon =
    ((longitude2 - longitude1) * Math.PI) /
    180;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return EARTH_RADIUS_KM * c;
};

export const addDistances = (
  facilities,
  location
) => {
  if (!location) {
    return facilities;
  }

  return facilities
    .map((facility) => ({
      ...facility,

      distance: calculateDistance(
        location.latitude,
        location.longitude,
        facility.latitude,
        facility.longitude
      ),
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance
    );
};