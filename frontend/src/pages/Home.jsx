import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Hospital,
  Clock,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import FacilityCard from "../components/FacilityCard";
import { useFacilities } from "../hooks/useFacilities";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");

  const {
    facilities,
    loading,
  } = useFacilities();

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      facility.address
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  return (
    <main>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
              <Hospital size={17} />
              Healthcare discovery made easier
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              Find the right healthcare facility near you.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Search hospitals, pharmacies, laboratories and
              other healthcare services across your area.
            </p>

            <div className="mt-8 max-w-2xl">
              <SearchBar
                value={query}
                onChange={setQuery}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/facilities"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
              >
                <Search size={18} />
                Explore facilities
              </Link>

              <Link
                to="/map"
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                <MapPin size={18} />
                View map
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<Search />}
            title="Search facilities"
            description="Find healthcare facilities by name, location or service."
          />

          <FeatureCard
            icon={<MapPin />}
            title="Find nearby"
            description="Use your location to discover healthcare facilities around you."
          />

          <FeatureCard
            icon={<Clock />}
            title="Opening information"
            description="View available opening and operating information."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Healthcare facilities
            </h2>

            <p className="mt-1 text-slate-500">
              Explore facilities available through AfyaLink.
            </p>
          </div>

          <Link
            to="/facilities"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <p>Loading facilities...</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredFacilities
              .slice(0, 3)
              .map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                />
              ))}
          </div>
        )}
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}