import { createContext, useContext, useEffect, useState } from "react";

import {
  clearSession,
  getCurrentUser,
  getSession,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  saveSession,
} from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession()?.user || null);
  const [loading, setLoading] = useState(Boolean(getSession()));

  useEffect(() => {
    if (!getSession()) return;

    getCurrentUser()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => {
        clearSession();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (request, credentials) => {
    const session = await request(credentials);
    saveSession(session);
    setUser(session.user);
    return session.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // A locally-expired session still needs to be cleared.
    } finally {
      clearSession();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: (credentials) => authenticate(loginRequest, credentials),
      register: (credentials) => authenticate(registerRequest, credentials),
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
