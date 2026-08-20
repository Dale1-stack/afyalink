import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Globe,
  HeartPulse,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Accessibility,
  Building2,
} from "lucide-react";

import { getFacilityById } from "../services/facilityApi";

export default function FacilityDetails() {
  const { id } = useParams();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFacility = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFacilityById(id);

        if (!data) {
          setFacility(null);
          return;
        }

        setFacility(data);
      } catch (err) {
        console.error(
          "Failed to load facility:",
          err
        );

        setError(
          "We could not load this healthcare facility."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFacility();
  }, [id]);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="animate-pulse">
          <div className="mb-8 h-5 w-40 rounded bg-slate-200" />

          <div className="rounded-3xl border border-slate-200 bg-white p-8">
            <div className="h-6 w-24 rounded bg-slate-200" />

            <div className="mt-5 h-10 w-2/3 rounded bg-slate-200" />

            <div className="mt-4 h-5 w-full max-w-2xl rounded bg-slate-200" />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-28 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <HeartPulse size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-red-900">
            Something went wrong
          </h1>

          <p className="mt-2 text-red-700">
            {error}
          </p>

          <Link
            to="/facilities"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to facilities
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Not found state
   */
  if (!facility) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Building2 size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Facility not found
          </h1>

          <p className="mx-auto mt-2 max-w-md text-slate-500">
            The healthcare facility you're looking
            for could not be found.
          </p>

          <Link
            to="/facilities"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to facilities
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Safely handle missing fields from OSM
   */
  const services = Array.isArray(
    facility.services
  )
    ? facility.services
    : [];

  const openingHours =
    facility.openingHours;

  const source =
    facility.source || "AfyaLink";

  const hasCoordinates =
    typeof facility.latitude === "number" &&
    typeof facility.longitude === "number";

  /*
   * Google Maps directions
   */
  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`
    : null;

  /*
   * OSM map URL
   */
  const osmUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${facility.latitude}&mlon=${facility.longitude}#map=18/${facility.latitude}/${facility.longitude}`
    : null;

  /*
   * Format OSM opening_hours strings
   */
  const formattedOpeningHours =
    typeof openingHours === "string"
      ? openingHours
      : null;

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Back button */}
        <Link
          to="/facilities"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to facilities
        </Link>

        {/* Main facility card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-slate-200 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {facility.type && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {facility.type}
                    </span>
                  )}

                  {facility.emergency && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      Emergency services
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                  {facility.name}
                </h1>

                {facility.description && (
                  <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                    {facility.description}
                  </p>
                )}
              </div>

              {/* Distance */}
              {typeof facility.distance ===
                "number" && (
                <div className="shrink-0 rounded-2xl bg-green-50 px-5 py-4 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {facility.distance.toFixed(
                      1
                    )}{" "}
                    km
                  </p>

                  <p className="text-xs font-medium text-green-600">
                    from your location
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left/main content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Contact information */}
                <section>
                  <SectionHeading
                    icon={<MapPin size={20} />}
                    title="Contact & location"
                  />

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <InfoCard
                      icon={<MapPin size={20} />}
                      title="Address"
                      value={
                        facility.address ||
                        "Address not available"
                      }
                    />

                    <InfoCard
                      icon={<Phone size={20} />}
                      title="Phone"
                      value={
                        facility.phone ||
                        "Phone number not available"
                      }
                      href={
                        facility.phone
                          ? `tel:${facility.phone}`
                          : null
                      }
                    />

                    <InfoCard
                      icon={<Globe size={20} />}
                      title="Website"
                      value={
                        facility.website
                          ? "Visit facility website"
                          : "Website not available"
                      }
                      href={
                        facility.website
                          ? facility.website
                          : null
                      }
                      external={
                        Boolean(
                          facility.website
                        )
                      }
                    />

                    <InfoCard
                      icon={
                        <Building2 size={20} />
                      }
                      title="County / Region"
                      value={
                        facility.county ||
                        "Not available"
                      }
                    />
                  </div>
                </section>

                {/* Services */}
                <section>
                  <SectionHeading
                    icon={
                      <HeartPulse size={20} />
                    }
                    title="Healthcare services"
                  />

                  {services.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {services.map(
                        (service) => (
                          <span
                            key={service}
                            className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                          >
                            {service}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyValue>
                      No services have been
                      listed for this facility.
                    </EmptyValue>
                  )}
                </section>

                {/* Opening hours */}
                <section>
                  <SectionHeading
                    icon={<Clock size={20} />}
                    title="Opening information"
                  />

                  <div className="mt-4">
                    {formattedOpeningHours ? (
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm leading-7 text-slate-700">
                          {formattedOpeningHours}
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                          Opening hours are provided
                          as listed in the available
                          facility data.
                        </p>
                      </div>
                    ) : typeof openingHours ===
                      "object" &&
                      openingHours !== null ? (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {Object.entries(
                          openingHours
                        ).map(
                          ([
                            day,
                            hours,
                          ]) => (
                            <div
                              key={day}
                              className="flex justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm"
                            >
                              <span className="font-medium capitalize text-slate-700">
                                {day}
                              </span>

                              <span className="text-right text-slate-500">
                                {hours}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <EmptyValue>
                        Opening hours are not
                        available.
                      </EmptyValue>
                    )}
                  </div>
                </section>

                {/* Additional information */}
                <section>
                  <SectionHeading
                    icon={
                      <ShieldCheck size={20} />
                    }
                    title="Additional information"
                  />

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <DetailRow
                      label="Emergency services"
                      value={
                        facility.emergency
                          ? "Available"
                          : "Not specified"
                      }
                      positive={
                        facility.emergency
                      }
                    />

                    <DetailRow
                      label="Wheelchair access"
                      value={
                        formatWheelchair(
                          facility.wheelchair
                        )
                      }
                      icon={
                        <Accessibility
                          size={18}
                        />
                      }
                    />

                    <DetailRow
                      label="Operator"
                      value={
                        facility.operator ||
                        "Not specified"
                      }
                    />

                    <DetailRow
                      label="Data source"
                      value={source}
                    />
                  </div>
                </section>
              </div>

              {/* Right sidebar */}
              <aside className="space-y-5">
                {/* Actions */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="font-bold text-slate-900">
                    Actions
                  </h2>

                  <div className="mt-4 space-y-3">
                    {directionsUrl ? (
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Navigation
                          size={18}
                        />
                        Get directions
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-3 font-semibold text-slate-500"
                      >
                        <Navigation
                          size={18}
                        />
                        Location unavailable
                      </button>
                    )}

                    {facility.phone && (
                      <a
                        href={`tel:${facility.phone}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Phone size={18} />
                        Call facility
                      </a>
                    )}

                    {facility.website && (
                      <a
                        href={facility.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Globe size={18} />
                        Visit website
                        <ExternalLink
                          size={15}
                        />
                      </a>
                    )}
                  </div>
                </div>

                {/* Coordinates */}
                {hasCoordinates && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h2 className="font-bold text-slate-900">
                      Location
                    </h2>

                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Coordinates
                      </p>

                      <p className="mt-2 font-mono text-sm text-slate-700">
                        {facility.latitude.toFixed(
                          6
                        )}
                        ,{" "}
                        {facility.longitude.toFixed(
                          6
                        )}
                      </p>
                    </div>

                    {osmUrl && (
                      <a
                        href={osmUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        View on OpenStreetMap
                        <ExternalLink
                          size={15}
                        />
                      </a>
                    )}
                  </div>
                )}

                {/* Data source */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Data source
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        This facility information
                        comes from{" "}
                        <strong>
                          {source}
                        </strong>
                        . Some information may
                        be incomplete or outdated.
                      </p>

                      <p className="mt-3 text-xs leading-5 text-slate-400">
                        Always verify important
                        information such as emergency
                        availability, opening hours and
                        contact details before relying
                        on it.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Reusable components
|--------------------------------------------------------------------------
*/

function SectionHeading({
  icon,
  title,
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-blue-600">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  href = null,
  external = false,
}) {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <p
          className={`mt-1 break-words text-sm ${
            href
              ? "font-medium text-blue-600"
              : "text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>

      {external && (
        <ExternalLink
          size={15}
          className="ml-auto shrink-0 text-slate-400"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={
          external ? "_blank" : undefined
        }
        rel={
          external
            ? "noopener noreferrer"
            : undefined
        }
        className="flex gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 p-4">
      {content}
    </div>
  );
}

function DetailRow({
  label,
  value,
  positive = false,
  icon = null,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {icon && (
          <span className="text-blue-600">
            {icon}
          </span>
        )}

        <span>{label}</span>
      </div>

      <span
        className={`text-right text-sm font-semibold ${
          positive
            ? "text-green-600"
            : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyValue({ children }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
      {children}
    </div>
  );
}

function formatWheelchair(value) {
  if (!value) {
    return "Not specified";
  }

  const normalized =
    String(value).toLowerCase();

  if (
    normalized === "yes" ||
    normalized === "true"
  ) {
    return "Available";
  }

  if (normalized === "no" ||
      normalized === "false") {
    return "Not available";
  }

  if (normalized === "limited") {
    return "Limited access";
  }

  return String(value);
}