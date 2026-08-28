import { useEffect, useMemo, useState } from "react";
import { MapPin, Loader2, RefreshCw } from "lucide-react";

import SearchBar from "../components/SearchBar";
import FacilityList from "../components/FacilityList";

import { useFacilities } from "../hooks/useFacilities";
import { useLocation } from "../hooks/useLocation";

import {
  getNearbyFacilities,
} from "../services/facilityApi";

import { addDistances } from "../utils/distance";

/*
|--------------------------------------------------------------------------
| Normalize services
|--------------------------------------------------------------------------
| Flask now returns service objects:
|
| {
|   id: 1,
|   name: "Emergency",
|   description: "Emergency medical services"
| }
|
| Older local data may still contain:
|
| ["Emergency", "Laboratory"]
|
| This function supports BOTH formats.
|--------------------------------------------------------------------------
*/

const normalizeServices = (services) => {
  if (!Array.isArray(services)) {
    return [];
  }

  return services
    .map((service) => {
      if (typeof service === "string") {
        return service;
      }

      if (service && typeof service === "object") {
        return service.name || "";
      }

      return "";
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| Normalize opening hours
|--------------------------------------------------------------------------
*/

const normalizeOpeningHours = (openingHours) => {
  if (!openingHours) {
    return {};
  }

  // If Flask/database returns an object
  if (
    typeof openingHours === "object" &&
    !Array.isArray(openingHours)
  ) {
    return openingHours;
  }

  // If old local data contains a string such as "24 hours"
  if (typeof openingHours === "string") {
    return {
      monday: openingHours,
      tuesday: openingHours,
      wednesday: openingHours,
      thursday: openingHours,
      friday: openingHours,
      saturday: openingHours,
      sunday: openingHours,
    };
  }

  return {};
};

/*
|--------------------------------------------------------------------------
| Normalize a facility returned from Flask or local data
|--------------------------------------------------------------------------
*/

const normalizeFacility = (facility) => {
  if (!facility) {
    return null;
  }

  return {
    ...facility,

    services: normalizeServices(facility.services),

    openingHours: normalizeOpeningHours(
      facility.openingHours || facility.opening_hours
    ),
  };
};

export default function Facilities() {
  const {
    facilities: initialFacilities,
    loading,
    error,
  } = useFacilities();

  const [facilities, setFacilities] = useState([]);
  const [query, setQuery] = useState("");
  const [service, setService] = useState("");
  const [nearbyMode, setNearbyMode] = useState(false);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState(null);

  const {
    location,
    loading: locationLoading,
    error: locationError,
    requestLocation,
  } = useLocation();

  /*
  |--------------------------------------------------------------------------
  | Load facilities returned from Flask
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!Array.isArray(initialFacilities)) {
      setFacilities([]);
      return;
    }

    const normalized = initialFacilities
      .map(normalizeFacility)
      .filter(Boolean);

    setFacilities(normalized);
  }, [initialFacilities]);

  /*
  |--------------------------------------------------------------------------
  | Get unique services
  |--------------------------------------------------------------------------
  */

  const services = useMemo(() => {
    return [
      ...new Set(
        facilities.flatMap(
          (facility) => facility.services || []
        )
      ),
    ].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [facilities]);

  /*
  |--------------------------------------------------------------------------
  | Search + filter
  |--------------------------------------------------------------------------
  */

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const searchTerm = query
        .trim()
        .toLowerCase();

      const matchesQuery =
        !searchTerm ||
        String(facility.name || "")
          .toLowerCase()
          .includes(searchTerm) ||
        String(facility.address || "")
          .toLowerCase()
          .includes(searchTerm) ||
        String(facility.county || "")
          .toLowerCase()
          .includes(searchTerm);

      const matchesService =
        !service ||
        (facility.services || []).includes(
          service
        );

      return (
        matchesQuery &&
        matchesService
      );
    });
  }, [facilities, query, service]);

  /*
  |--------------------------------------------------------------------------
  | Find nearby facilities using OSM
  |--------------------------------------------------------------------------
  */

  const findNearby = async () => {
    try {
      setNearbyLoading(true);
      setNearbyError(null);

      const currentLocation =
        await requestLocation();

      const nearby =
        await getNearbyFacilities({
          latitude:
            currentLocation.latitude,

          longitude:
            currentLocation.longitude,

          radius: 10000,
        });

      const normalized = Array.isArray(
        nearby
      )
        ? nearby
            .map(normalizeFacility)
            .filter(Boolean)
        : [];

      const facilitiesWithDistances =
        addDistances(
          normalized,
          currentLocation
        );

      setFacilities(
        facilitiesWithDistances
      );

      setNearbyMode(true);
    } catch (err) {
      console.error(
        "Failed to find nearby facilities:",
        err
      );

      setNearbyError(
        err?.message ||
          "Unable to find nearby healthcare facilities."
      );
    } finally {
      setNearbyLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Return to all facilities from Flask
  |--------------------------------------------------------------------------
  */

  const showAllFacilities = () => {
    const normalized =
      Array.isArray(initialFacilities)
        ? initialFacilities
            .map(normalizeFacility)
            .filter(Boolean)
        : [];

    setFacilities(normalized);
    setNearbyMode(false);
    setNearbyError(null);
    setQuery("");
    setService("");
  };

  /*
  |--------------------------------------------------------------------------
  | Loading state
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={36}
              className="mx-auto mb-4 animate-spin text-blue-600"
            />

            <p className="text-slate-600">
              Loading healthcare facilities...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* HEADER */}

      <div className="mb-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Healthcare Facilities
            </h1>

            <p className="mt-2 text-slate-500">
              Find hospitals, pharmacies,
              laboratories and other healthcare
              services.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={findNearby}
              disabled={
                locationLoading ||
                nearbyLoading
              }
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locationLoading ||
              nearbyLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Finding nearby...
                </>
              ) : (
                <>
                  <MapPin size={18} />

                  Find near me
                </>
              )}
            </button>

            {nearbyMode && (
              <button
                type="button"
                onClick={
                  showAllFacilities
                }
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw size={17} />

                Show all
              </button>
            )}
          </div>
        </div>

        {nearbyMode && (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Showing healthcare facilities
            within approximately 10 km of your
            current location.
          </div>
        )}

        {locationError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {locationError}
          </div>
        )}

        {nearbyError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {nearbyError}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* SEARCH + FILTER */}

      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_260px]">
        <SearchBar
          value={query}
          onChange={setQuery}
        />

        <select
          value={service}
          onChange={(event) =>
            setService(event.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            All services
          </option>

          {services.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS SUMMARY */}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredFacilities.length}
          </span>{" "}
          facilities
        </p>

        {service && (
          <button
            type="button"
            onClick={() => setService("")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* FACILITIES */}

      {filteredFacilities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <MapPin
            size={40}
            className="mx-auto mb-4 text-slate-400"
          />

          <h2 className="text-lg font-semibold text-slate-800">
            No facilities found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or
            service filter.
          </p>
        </div>
      ) : (
        <FacilityList
          facilities={filteredFacilities}
        />
      )}
    </main>
  );
}