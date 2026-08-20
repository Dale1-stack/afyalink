import {
  ArrowRight,
  HeartPulse,
  Hospital,
  Pill,
  FlaskConical,
  Baby,
  ScanLine,
  Stethoscope,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  healthcareServices,
} from "../data/services";

const icons = {
  emergency: HeartPulse,
  hospital: Hospital,
  clinic: Stethoscope,
  pharmacy: Pill,
  laboratory: FlaskConical,
  maternity: Baby,
  radiology: ScanLine,
  doctors: Stethoscope,
};

export default function Services() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold">
          Healthcare services
        </h1>

        <p className="mt-3 text-slate-500">
          Find healthcare facilities based on
          the service you need.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {healthcareServices.map(
          (service) => {
            const Icon =
              icons[service.id] ||
              HeartPulse;

            return (
              <Link
                key={service.id}
                to={`/facilities?service=${service.id}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </div>

                <h2 className="mt-6 text-lg font-bold">
                  {service.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>
              </Link>
            );
          }
        )}
      </div>
    </main>
  );
}