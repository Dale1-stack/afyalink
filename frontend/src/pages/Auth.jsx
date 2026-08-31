import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const { user, login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/manage" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await (isRegister ? register : login)({ email, password });
      navigate(location.state?.from || "/manage", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Could not authenticate your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md items-center px-6 py-12">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold">{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-slate-600">
          {isRegister ? "Register to add and manage your own healthcare data." : "Log in to manage your healthcare data."}
        </p>
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-medium text-slate-700">Email address
            <input type="email" autoComplete="email" value={email} required onChange={(event) => setEmail(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">Password
            <input type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} minLength={isRegister ? 12 : undefined} required onChange={(event) => setPassword(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
          </label>
          {isRegister && <label className="grid gap-1 text-sm font-medium text-slate-700">Confirm password
            <input type="password" autoComplete="new-password" value={confirmPassword} minLength="12" required onChange={(event) => setConfirmPassword(event.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 font-normal" />
          </label>}
          {isRegister && <p className="text-xs text-slate-500">Use at least 12 characters.</p>}
          <button disabled={submitting} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {submitting ? "Please wait..." : isRegister ? "Create account" : "Log in"}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-600">
          {isRegister ? "Already have an account?" : "New to AfyaLink?"} {" "}
          <Link to={isRegister ? "/login" : "/register"} className="font-semibold text-blue-700 hover:underline">
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
