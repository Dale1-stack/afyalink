import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Navigation,
  ShieldCheck,
  Accessibility,
  Building2,
  Loader2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";

import {
  getFacilityById,
} from "../services/facilityApi";

/*
|--------------------------------------------------------------------------
| Normalize services
|--------------------------------------------------------------------------
*/

const normalizeServices = (
  services
) => {
  if (!Array.isArray(services)) {
    return [];
  }

  return services
    .map((service) => {
      if (typeof service === "string") {
        return service;
      }

      if (
        service &&
        typeof service === "object"
      ) {
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

const normalizeOpeningHours = (
  openingHours
) => {
  if (!openingHours) {
    return {};
  }

  /*
   * PostgreSQL JSONB should arrive as an object.
   */

  if (
    typeof openingHours === "object" &&
    !Array.isArray(openingHours)
  ) {
    return openingHours;
  }

  /*
   * Support old local data:
   *
   * openingHours: "24 hours"
   */

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
| Normalize facility
|--------------------------------------------------------------------------
*/

const normalizeFacility = (
  facility
) => {
  if (!facility) {
    return null;
  }

  return {
    ...facility,

    services: normalizeServices(
      facility.services
    ),

    openingHours:
      normalizeOpeningHours(
        facility.openingHours ||
          facility.opening_hours
      ),
  };
};

/*
|--------------------------------------------------------------------------
| Format opening-hours key
|--------------------------------------------------------------------------
*/

const formatDayName = (
  day
) => {
  if (!day) {
    return "";
  }

  return (
    day.charAt(0).toUpperCase() +
    day.slice(1)
  );
};

/*
|--------------------------------------------------------------------------
| Google Maps URL
|--------------------------------------------------------------------------
*/

const getDirectionsUrl = (
  facility
) => {
  if (
    facility?.latitude == null ||
    facility?.longitude == null
  ) {
    return null;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
};

export default function FacilityDetails() {
  const { id } = useParams();

  const [facility, setFacility] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load facility
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadFacility = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getFacilityById(id);

        if (!mounted) {
          return;
        }

        if (!data) {
          setError(
            "Healthcare facility not found."
          );

          setFacility(null);
          return;
        }

        setFacility(
          normalizeFacility(data)
        );
      } catch (err) {
        console.error(
          "Failed to load facility:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Failed to load healthcare facility."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFacility();

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={40}
              className="mx-auto mb-4 animate-spin text-blue-600"
            />

            <p className="text-slate-600">
              Loading facility...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error || !facility) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <Link
          to="/facilities"
          className="mb-8 inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />

          Back to facilities
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle
            size={42}
            className="mx-auto mb-4 text-red-500"
          />

          <h1 className="text-xl font-bold text-red-800">
            Facility unavailable
          </h1>

          <p className="mt-2 text-red-700">
            {error ||
              "The requested facility could not be found."}
          </p>
        </div>
      </main>
    );
  }

  const services =
    facility.services || [];

  const openingHours =
    facility.openingHours || {};

  const directionsUrl =
    getDirectionsUrl(facility);

  const hasCoordinates =
    facility.latitude != null &&
    facility.longitude != null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* BACK */}

      <Link
        to="/facilities"
        className="mb-8 inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} />

        Back to facilities
      </Link>

      {/* HERO */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-10 text-white md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {facility.type && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
                    {facility.type}
                  </span>
                )}

                {facility.emergency && (
                  <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold">
                    Emergency
                  </span>
                )}

                {facility.source && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                    {facility.source}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold md:text-4xl">
                {facility.name ||
                  "Healthcare Facility"}
              </h1>

              {facility.description && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-blue-50">
                  {facility.description}
                </p>
              )}
            </div>

            <div className="hidden rounded-2xl bg-white/10 p-4 md:block">
              <Building2 size={42} />
            </div>
          </div>
        </div>

        {/* QUICK INFORMATION */}

        <div className="grid gap-4 border-b border-slate-200 p-6 md:grid-cols-3 md:p-8">
          {/* ADDRESS */}

          <div className="flex gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <MapPin size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Address
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {facility.address ||
                  "Address unavailable"}
              </p>

              {facility.county && (
                <p className="text-sm text-slate-500">
                  {facility.county}
                </p>
              )}
            </div>
          </div>

          {/* PHONE */}

          <div className="flex gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <Phone size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Phone
              </p>

              {facility.phone ? (
                <a
                  href={`tel:${facility.phone}`}
                  className="mt-1 block font-medium text-slate-900 hover:text-blue-600"
                >
                  {facility.phone}
                </a>
              ) : (
                <p className="mt-1 text-slate-500">
                  Not available
                </p>
              )}
            </div>
          </div>

          {/* ACCESSIBILITY */}

          <div className="flex gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <Accessibility size={22} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Accessibility
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {facility.wheelchair ===
                "yes"
                  ? "Wheelchair accessible"
                  : facility.wheelchair ===
                    "no"
                  ? "Not wheelchair accessible"
                  : "Information unavailable"}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
          {/* SERVICES */}

          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Stethoscope size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Services
                </h2>

                <p className="text-sm text-slate-500">
                  Healthcare services available
                  at this facility
                </p>
              </div>
            </div>

            {services.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map(
                  (service, index) => (
                    <div
                      key={
                        typeof service ===
                        "string"
                          ? service
                          : service?.id ||
                            index
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="font-medium text-slate-800">
                        {typeof service ===
                        "string"
                          ? service
                          : service?.name ||
                            "Healthcare service"}
                      </p>

                      {typeof service ===
                        "object" &&
                        service?.description && (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              service.description
                            }
                          </p>
                        )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                No services listed.
              </div>
            )}
          </section>

          {/* OPENING HOURS */}

          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <Clock size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Opening Hours
                </h2>

                <p className="text-sm text-slate-500">
                  Facility operating schedule
                </p>
              </div>
            </div>

            {Object.keys(openingHours)
              .length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {Object.entries(
                  openingHours
                ).map(
                  ([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0"
                    >
                      <span className="font-medium text-slate-700">
                        {formatDayName(day)}
                      </span>

                      <span className="text-sm text-slate-500">
                        {String(hours)}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                Opening hours are not
                available.
              </div>
            )}
          </section>
        </div>

        {/* LOCATION */}

        <section className="border-t border-slate-200 p-6 md:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Location
              </h2>

              {hasCoordinates && (
                <p className="mt-1 text-sm text-slate-500">
                  Coordinates:{" "}
                  {facility.latitude},{" "}
                  {facility.longitude}
                </p>
              )}
            </div>

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Navigation size={17} />

                Get directions
              </a>
            )}
          </div>

          {hasCoordinates ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <iframe
                title={`${facility.name} location`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  Number(
                    facility.longitude
                  ) - 0.01
                },${
                  Number(
                    facility.latitude
                  ) - 0.01
                },${
                  Number(
                    facility.longitude
                  ) + 0.01
                },${
                  Number(
                    facility.latitude
                  ) + 0.01
                }&layer=mapnik&marker=${
                  facility.latitude
                },${
                  facility.longitude
                }`}
                className="h-[350px] w-full border-0"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex min-h-[250px] items-center justify-center rounded-2xl bg-slate-50">
              <div className="text-center">
                <MapPin
                  size={40}
                  className="mx-auto mb-3 text-slate-400"
                />

                <p className="text-slate-500">
                  Location coordinates are
                  unavailable.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ADDITIONAL INFORMATION */}

        {(facility.operator ||
          facility.osmId ||
          facility.osmType ||
          facility.emergency) && (
          <section className="border-t border-slate-200 bg-slate-50 p-6 md:p-8">
            <h2 className="mb-5 text-xl font-bold text-slate-900">
              Additional Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {facility.operator && (
                <div>
                  <p className="text-sm text-slate-500">
                    Operator
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {facility.operator}
                  </p>
                </div>
              )}

              {facility.osmId && (
                <div>
                  <p className="text-sm text-slate-500">
                    OSM ID
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {facility.osmId}
                  </p>
                </div>
              )}

              {facility.osmType && (
                <div>
                  <p className="text-sm text-slate-500">
                    OSM Type
                  </p>

                  <p className="mt-1 font-medium capitalize text-slate-800">
                    {facility.osmType}
                  </p>
                </div>
              )}

              {facility.emergency && (
                <div className="flex items-center gap-2 text-red-600">
                  <ShieldCheck size={20} />

                  <span className="font-semibold">
                    Emergency services
                    available
                  </span>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}