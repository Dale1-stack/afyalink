import { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import FacilityList from "../components/FacilityList";
import { useFacilities } from "../hooks/useFacilities";

import {
  MapPin,
  Loader2,
} from "lucide-react";

import { useLocation } from "../hooks/useLocation";

import {
  getNearbyFacilities,
} from "../services/facilityApi";

import {
  addDistances,
} from "../utils/distance";


export default function Facilities() {
  const {
  facilities: initialFacilities,
  loading,
  error,
} = useFacilities();

const [facilities, setFacilities] =
  useState([]);

useEffect(() => {
  setFacilities(initialFacilities);
}, [initialFacilities]);

  const [query, setQuery] = useState("");
  const [service, setService] = useState("");

  const services = useMemo(() => {
    return [
      ...new Set(
        facilities.flatMap(
          (facility) => facility.services
        )
      ),
    ].sort();
  }, [facilities]);

  const filteredFacilities = facilities.filter(
    (facility) => {
      const matchesQuery =
        !query ||
        facility.name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        facility.address
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesService =
        !service ||
        facility.services.includes(service);

      return matchesQuery && matchesService;
    }
  );

  const {
  location,
  loading: locationLoading,
  error: locationError,
  requestLocation,
} = useLocation();

const [nearbyMode, setNearbyMode] =
  useState(false);

const findNearby = async () => {
  try {
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

    setFacilities(
      addDistances(
        nearby,
        currentLocation
      )
    );

    setNearbyMode(true);
  } catch {
    // Error already handled by hook.
  }
};

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">
          Healthcare facilities
        </h1>

        <button
         onClick={findNearby}
         disabled={locationLoading}
         className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {locationLoading ? (
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
        {locationError && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {locationError}
           </div>
        )}
        </button>

        <p className="mt-2 text-slate-500">
          Search and filter healthcare facilities.
        </p>
      </div>





      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_240px]">
        <SearchBar
          value={query}
          onChange={setQuery}
        />

        <select
          value={service}
          onChange={(event) =>
            setService(event.target.value)
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-500"
        >
          <option value="">
            All services
          </option>

          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          Loading facilities...
        </div>
      ) : (
        <FacilityList
          facilities={filteredFacilities}
        />
      )}
    </main>
  );
}