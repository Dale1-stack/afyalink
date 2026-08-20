import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <HeartPulse
            size={18}
            className="text-blue-600"
          />

          AfyaLink
        </div>

        <p>
          Healthcare facility discovery platform.
        </p>

        <p>
          © {new Date().getFullYear()} AfyaLink
        </p>
      </div>
    </footer>
  );
}