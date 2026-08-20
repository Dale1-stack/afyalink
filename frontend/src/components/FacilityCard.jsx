import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Clock,
  ChevronRight,
} from "lucide-react";

import DataSourceBadge from "./DataSourceBadge";

export default function FacilityCard({ facility }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {facility.type}
          </span>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {facility.name}
          </h3>
        </div>

        {facility.emergency && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Emergency
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-slate-600">

        {facility.distance != null && (
          <div className="flex gap-2">
            <MapPin size={18} className="shrink-0 text-green-600" />
            <span className="font-medium text-green-700">{facility.distance.toFixed(1)} km away</span>
          </div>
        )}
        <div className="flex gap-2">
          <MapPin size={18} className="shrink-0 text-blue-600" />
          <span>{facility.address}</span>
        </div>

        <div className="flex gap-2">
          <Phone size={18} className="shrink-0 text-blue-600" />
          <span>{facility.phone}</span>
        </div>

        <div className="flex gap-2">
          <Clock size={18} className="shrink-0 text-blue-600" />
          <span>{facility.openingHours.monday}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {facility.services
            .slice(0, 5)
            .map((service) => (
             <span
               key={service}
               className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
             >
              {service}
             </span>

             
        ))}

        {facility.website && (
         <a
          href={facility.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-sm font-medium text-blue-600 hover:underline"
         >
         Visit website
         </a>
)}
      </div>

      <Link
        to={`/facilities/${facility.id}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        View facility
        <ChevronRight size={17} />
      </Link>

      <DataSourceBadge
        source={facility.source || "AfyaLink"}
      />
    </div>
  );
}