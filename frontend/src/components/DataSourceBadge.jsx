export default function DataSourceBadge({
  source = "OpenStreetMap",
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
      Data source: {source}
    </span>
  );
}