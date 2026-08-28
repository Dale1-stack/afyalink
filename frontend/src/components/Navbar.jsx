import { Link } from "react-router-dom";
import { HeartPulse, MapPin } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-700"
        >
          <HeartPulse size={28} />

          <span>AfyaLink</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/facilities"
            className="text-slate-600 hover:text-blue-700"
          >
            Facilities
          </Link>

          <Link
            to="/services"
            className="text-slate-600 hover:text-blue-700"
          >
            Services
          </Link>

          <Link
            to="/map"
            className="flex items-center gap-1 text-slate-600 hover:text-blue-700"
          >
            <MapPin size={17} />
            Map
          </Link>

          <Link
            to="/about"
            className="text-slate-600 hover:text-blue-700"
          >
            About
          </Link>

          <Link
            to="/manage"
            className="text-slate-600 hover:text-blue-700"
          >
            Manage
          </Link>
        </div>
      </div>
    </nav>
  );
}
