import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, MapPin } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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

          {user ? (
            <>
              <Link to="/manage" className="text-slate-600 hover:text-blue-700">Manage</Link>
              <span className="max-w-40 truncate text-sm text-slate-500" title={user.email}>{user.email}</span>
              <button type="button" onClick={handleLogout} className="text-slate-600 hover:text-blue-700">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-blue-700">Log in</Link>
              <Link to="/register" className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
