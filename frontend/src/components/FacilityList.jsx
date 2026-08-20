import FacilityCard from "./FacilityCard";

export default function FacilityList({ facilities }) {
  if (!facilities.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-slate-900">
          No facilities found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.id}
          facility={facility}
        />
      ))}
    </div>
  );
}