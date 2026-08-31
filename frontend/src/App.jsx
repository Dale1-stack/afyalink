import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";
import Services from "./pages/Services";
import Map from "./pages/Map";
import Manage from "./pages/Manage";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";

function About() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-3xl font-bold">
        About AfyaLink
      </h1>

      <p className="mt-4 max-w-2xl text-slate-600">
        AfyaLink helps people discover healthcare
        facilities, services and locations more
        easily.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/facilities"
          element={<Facilities />}
        />

        <Route
          path="/facilities/:id"
          element={<FacilityDetails />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/map"
          element={<Map />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/manage"
          element={<RequireAuth><Manage /></RequireAuth>}
        />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
      </Routes>

      <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
