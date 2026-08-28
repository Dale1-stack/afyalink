import {
  Clock,
  MapPin,
  Navigation,
  Phone,
  Stethoscope,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Get today's opening hours
|--------------------------------------------------------------------------
*/

const getTodayOpeningHours = (
  openingHours
) => {
  if (!openingHours) {
    return "Opening hours unavailable";
  }

  if (
    typeof openingHours === "string"
  ) {
    return openingHours;
  }

  if (
    typeof openingHours === "object" &&
    !Array.isArray(openingHours)
  ) {
    const today =
      new Date()
        .toLocaleDateString(
          "en-US",
          {
            weekday: "long",
          }
        )
        .toLowerCase();

    return (
      openingHours[today] ||
      "Opening hours unavailable"
    );
  }

  return "Opening hours unavailable";
};

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
      if (
        typeof service ===
        "string"
      ) {
        return service;
      }

      if (
        service &&
        typeof service ===
          "object"
      ) {
        return (
          service.name ||
          service.title ||
          service.description ||
          ""
        );
      }

      return "";
    })
    .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| Facility Card
|--------------------------------------------------------------------------
*/

export default function FacilityCard({
  facility,
}) {
  if (!facility) {
    return null;
  }

  const {
    id,
    name,
    address,
    phone,
    latitude,
    longitude,
    opening_hours,
    openingHours,
    emergency,
    type,
    county,
  } = facility;

  const services =
    normalizeServices(
      facility.services
    );

  /*
  |--------------------------------------------------------------------------
  | Support both backend naming styles
  |--------------------------------------------------------------------------
  */

  const facilityOpeningHours =
    opening_hours ||
    openingHours;

  /*
  |--------------------------------------------------------------------------
  | Today's hours
  |--------------------------------------------------------------------------
  */

  const todayHours =
    getTodayOpeningHours(
      facilityOpeningHours
    );

  /*
  |--------------------------------------------------------------------------
  | Google Maps directions
  |--------------------------------------------------------------------------
  */

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const directionsUrl =
    hasCoordinates
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
      : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-5 text-white">

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Stethoscope
                size={25}
              />
            </div>

            <div className="min-w-0">

              <h3
                className="truncate text-lg font-bold"
                title={
                  name ||
                  "Healthcare Facility"
                }
              >
                {name ||
                  "Healthcare Facility"}
              </h3>

              <p className="mt-1 text-sm text-blue-100">
                {type ||
                  "Healthcare Facility"}
              </p>

            </div>

          </div>

          {/* Emergency badge */}

          {emergency && (
            <span className="shrink-0 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              Emergency
            </span>
          )}

        </div>

      </div>

      {/* ================================================================ */}
      {/* CONTENT */}
      {/* ================================================================ */}

      <div className="flex flex-1 flex-col p-5">

        {/* ADDRESS */}

        <div className="mb-4 flex items-start gap-3">

          <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
            <MapPin size={18} />
          </div>

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Location
            </p>

            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {address ||
                "Address unavailable"}
            </p>

            {county && (
              <p className="mt-1 text-xs text-slate-400">
                {county}
              </p>
            )}

          </div>

        </div>

        {/* PHONE */}

        <div className="mb-4 flex items-start gap-3">

          <div className="rounded-lg bg-green-50 p-2 text-green-600">
            <Phone size={18} />
          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Phone
            </p>

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="mt-1 block text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                {phone}
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-400">
                Not available
              </p>
            )}

          </div>

        </div>

        {/* OPENING HOURS */}

        <div className="mb-4 flex items-start gap-3">

          <div className="rounded-lg bg-green-50 p-2 text-green-600">
            <Clock size={18} />
          </div>

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Opening Hours
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {todayHours}
            </p>

          </div>

        </div>

        {/* SERVICES */}

        {services.length > 0 && (
          <div className="mb-5">

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Services
            </p>

            <div className="flex flex-wrap gap-2">

              {services
                .slice(0, 4)
                .map(
                  (
                    service,
                    index
                  ) => (
                    <span
                      key={`${service}-${index}`}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {service}
                    </span>
                  )
                )}

              {services.length >
                4 && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  +
                  {services.length -
                    4}{" "}
                  more
                </span>
              )}

            </div>

          </div>
        )}

        {/* Push actions to bottom */}

        <div className="flex-1" />

        {/* ============================================================ */}
        {/* ACTIONS */}
        {/* ============================================================ */}

        <div className="mt-4 grid grid-cols-2 gap-3">

          <Link
            to={`/facilities/${id}`}
            className="flex items-center justify-center rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View Details
          </Link>

          {directionsUrl ? (
            <a
              href={
                directionsUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Navigation
                size={16}
              />

              Directions
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400"
            >
              Directions
            </button>
          )}

        </div>

      </div>

    </article>
  );
}