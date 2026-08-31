const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000/api"
).replace(/\/$/, "");

const SESSION_KEY = "afyalink.auth";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }
  return data;
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function getAccessToken() {
  return getSession()?.access_token || null;
}

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export const register = (credentials) => request("/auth/register", {
  method: "POST",
  body: JSON.stringify(credentials),
});

export const login = (credentials) => request("/auth/login", {
  method: "POST",
  body: JSON.stringify(credentials),
});

export const getCurrentUser = () => request("/auth/me", {
  headers: { Authorization: `Bearer ${getAccessToken()}` },
});

export const logout = () => request("/auth/logout", {
  method: "POST",
  headers: { Authorization: `Bearer ${getAccessToken()}` },
});
