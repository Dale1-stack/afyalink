import { useState } from "react";

import {
  LocateFixed,
  Loader2,
  MapPin,
} from "lucide-react";

import MapView from "../components/MapView";

import { useLocation } from "../hooks/useLocation";

import {
  getNearbyFacilities,
} from "../services/facilityApi";

import {
  addDistances,
} from "../utils/distance";

export default function Map() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
    requestLocation,
  } = useLocation();

  const [facilities, setFacilities] =
    useState([]);

  const [loadingFacilities, setLoadingFacilities] =
    useState(false);

  const [error, setError] =
    useState(null);

  const findNearby = async () => {
    try {
      setError(null);

      const currentLocation =
        await requestLocation();

      setLoadingFacilities(true);

      const nearby =
        await getNearbyFacilities({
          latitude:
            currentLocation.latitude,

          longitude:
            currentLocation.longitude,

          radius: 10000,
        });

      const withDistances =
        addDistances(
          nearby,
          currentLocation
        );

      setFacilities(
        withDistances
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingFacilities(false);
    }
  };

  return (
    <main className="h-[calc(100vh-73px)]">
      <div className="relative h-full">
        <MapView
          facilities={facilities}
          location={location}
        />

        <div className="absolute left-4 top-4 z-[1000] w-[calc(100%-2rem)] max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <MapPin size={20} />
              </div>

              <div>
                <h1 className="font-bold">
                  Find healthcare near you
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Use your location to discover
                  nearby healthcare facilities.
                </p>
              </div>
            </div>

            <button
              onClick={findNearby}
              disabled={
                locationLoading ||
                loadingFacilities
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locationLoading ||
              loadingFacilities ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Finding facilities...
                </>
              ) : (
                <>
                  <LocateFixed size={18} />

                  Find facilities near me
                </>
              )}
            </button>

            {locationError && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {locationError}
              </p>
            )}

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {facilities.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold">
                  {facilities.length} facilities found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Results are sorted by distance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}