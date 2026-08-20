import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  /*
   * --------------------------------------------------
   * LOCAL FACILITIES
   * --------------------------------------------------
   */

  const {
    facilities: initialFacilities,
    loading,
    error,
  } = useFacilities();


  /*
   * This is the facilities actually displayed
   * on the page.
   */
  const [facilities, setFacilities] =
    useState([]);


  /*
   * Load the local facilities when they become
   * available.
   */
  useEffect(() => {
    if (initialFacilities?.length) {
      setFacilities(initialFacilities);
    }
  }, [initialFacilities]);


  /*
   * --------------------------------------------------
   * SEARCH / FILTER STATE
   * --------------------------------------------------
   */

  const [query, setQuery] =
    useState("");

  const [service, setService] =
    useState("");

  const [nearbyMode, setNearbyMode] =
    useState(false);


  /*
   * --------------------------------------------------
   * LOCATION
   * --------------------------------------------------
   */

  const {
    loading: locationLoading,
    error: locationError,
    requestLocation,
  } = useLocation();


  /*
   * --------------------------------------------------
   * SERVICE FILTER OPTIONS
   * --------------------------------------------------
   *
   * Build the service dropdown dynamically from
   * the facilities currently loaded.
   */

  const services = useMemo(() => {
    return [
      ...new Set(
        facilities.flatMap(
          (facility) =>
            Array.isArray(facility.services)
              ? facility.services
              : []
        )
      ),
    ].sort();
  }, [facilities]);


  /*
   * --------------------------------------------------
   * SEARCH + FILTER
   * --------------------------------------------------
   */

  const filteredFacilities =
    useMemo(() => {
      return facilities.filter(
        (facility) => {

          const name =
            facility.name || "";

          const address =
            facility.address || "";

          const facilityServices =
            Array.isArray(facility.services)
              ? facility.services
              : [];


          const matchesQuery =
            !query ||
            name
              .toLowerCase()
              .includes(
                query.toLowerCase()
              ) ||
            address
              .toLowerCase()
              .includes(
                query.toLowerCase()
              );


          const matchesService =
            !service ||
            facilityServices.includes(
              service
            );


          return (
            matchesQuery &&
            matchesService
          );
        }
      );
    }, [
      facilities,
      query,
      service,
    ]);


  /*
   * --------------------------------------------------
   * FIND NEARBY FACILITIES
   * --------------------------------------------------
   */

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


      /*
       * Add distances to OSM facilities.
       */
      const nearbyWithDistances =
        addDistances(
          nearby,
          currentLocation
        );


      /*
       * ------------------------------------------------
       * IMPORTANT
       * ------------------------------------------------
       *
       * Keep the local facilities AND add OSM
       * facilities.
       *
       * Previously you were doing:
       *
       * setFacilities(nearbyWithDistances)
       *
       * which removed all your local facilities.
       */

      setFacilities((currentFacilities) => {

        const combined = [
          ...currentFacilities,
          ...nearbyWithDistances,
        ];


        /*
         * Remove duplicate facilities.
         *
         * OSM facilities have IDs such as:
         *
         * osm-node-123456
         *
         * Local facilities have IDs such as:
         *
         * 1
         * 2
         * 3
         */

        const uniqueFacilities =
          combined.filter(
            (facility, index, array) => {

              const facilityId =
                String(
                  facility.id
                );

              return (
                array.findIndex(
                  (item) =>
                    String(item.id) ===
                    facilityId
                ) === index
              );
            }
          );


        return uniqueFacilities;
      });


      setNearbyMode(true);

    } catch (error) {

      console.error(
        "Unable to find nearby facilities:",
        error
      );

    }
  };


  /*
   * --------------------------------------------------
   * RESET TO LOCAL FACILITIES
   * --------------------------------------------------
   */

  const resetFacilities = () => {
    setFacilities(
      initialFacilities || []
    );

    setNearbyMode(false);
    setQuery("");
    setService("");
  };


  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* --------------------------------------------- */}
      {/* PAGE HEADER                                   */}
      {/* --------------------------------------------- */}

      <div className="mb-10">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Healthcare facilities
            </h1>

            <p className="mt-2 text-slate-500">
              Search and discover healthcare facilities
              near you.
            </p>

          </div>


          {/* ----------------------------------------- */}
          {/* LOCATION BUTTONS                          */}
          {/* ----------------------------------------- */}

          <div className="flex flex-wrap gap-3">

            <button
              onClick={findNearby}
              disabled={locationLoading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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

            </button>


            {nearbyMode && (
              <button
                onClick={resetFacilities}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Show all facilities
              </button>
            )}

          </div>

        </div>


        {/* ------------------------------------------- */}
        {/* LOCATION ERROR                              */}
        {/* ------------------------------------------- */}

        {locationError && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {locationError}
          </div>
        )}

      </div>


      {/* --------------------------------------------- */}
      {/* DATA SOURCE INFORMATION                       */}
      {/* --------------------------------------------- */}

      <div className="mb-6 flex flex-wrap items-center gap-3">

        <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          {facilities.length} facilities loaded
        </div>


        {nearbyMode && (
          <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            Including nearby OpenStreetMap facilities
          </div>
        )}

      </div>


      {/* --------------------------------------------- */}
      {/* SEARCH + SERVICE FILTER                      */}
      {/* --------------------------------------------- */}

      <div className="mb-8 grid gap-4 md:grid-cols-[1fr_240px]">

        <SearchBar
          value={query}
          onChange={setQuery}
        />


        <select
          value={service}
          onChange={(event) =>
            setService(
              event.target.value
            )
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500"
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


      {/* --------------------------------------------- */}
      {/* ERROR                                        */}
      {/* --------------------------------------------- */}

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}


      {/* --------------------------------------------- */}
      {/* LOADING                                      */}
      {/* --------------------------------------------- */}

      {loading ? (

        <div className="py-20 text-center">

          <Loader2
            size={30}
            className="mx-auto mb-4 animate-spin text-blue-600"
          />

          <p className="text-slate-500">
            Loading healthcare facilities...
          </p>

        </div>

      ) : (

        <>

          {/* ----------------------------------------- */}
          {/* SEARCH RESULT COUNT                       */}
          {/* ----------------------------------------- */}

          <div className="mb-5 text-sm text-slate-500">

            Showing{" "}

            <span className="font-semibold text-slate-900">
              {filteredFacilities.length}
            </span>

            {" "}of{" "}

            <span className="font-semibold text-slate-900">
              {facilities.length}
            </span>

            {" "}facilities

          </div>


          {/* ----------------------------------------- */}
          {/* FACILITY LIST                             */}
          {/* ----------------------------------------- */}

          {filteredFacilities.length > 0 ? (

            <FacilityList
              facilities={
                filteredFacilities
              }
            />

          ) : (

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">

              <MapPin
                size={40}
                className="mx-auto mb-4 text-slate-300"
              />

              <h2 className="text-lg font-semibold text-slate-900">
                No facilities found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or
                service filter.
              </p>

              <button
                onClick={resetFacilities}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Show all facilities
              </button>

            </div>

          )}

        </>

      )}

    </main>
  );
}