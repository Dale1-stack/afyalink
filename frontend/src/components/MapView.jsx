import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  CircleMarker,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";

const DEFAULT_CENTER = [
  -1.286389,
  36.817223,
];

function RecenterMap({
  location,
}) {
  const map = useMap();

  useEffect(() => {
    if (!location) {
      return;
    }

    map.flyTo(
      [
        location.latitude,
        location.longitude,
      ],
      14
    );
  }, [location, map]);

  return null;
}

function FacilityMarkers({
  facilities,
}) {
  return (
    <>
      {facilities.map((facility) => (
        <Marker
          key={facility.id}
          position={[
            facility.latitude,
            facility.longitude,
          ]}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold">
                {facility.name}
              </h3>

              <p className="mt-1 text-sm">
                {facility.type}
              </p>

              {facility.distance != null && (
                <p className="mt-2 text-sm">
                  {facility.distance.toFixed(
                    1
                  )}{" "}
                  km away
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function MapView({
  facilities = [],
  location = null,
}) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap
        location={location}
      />

      <FacilityMarkers
        facilities={facilities}
      />

      {location && (
        <CircleMarker
          center={[
            location.latitude,
            location.longitude,
          ]}
          radius={9}
        >
          <Popup>
            Your current location
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}