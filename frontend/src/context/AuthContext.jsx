import { createContext, useContext, useState, useEffect } from "react";
import { api, setToken, clearAuth, saveUser, getUser } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getUser());
  const [loading, setLoading] = useState(false);

  async function login(username, password) {
    setLoading(true);
    try {
      const data = await api.login({ username, password });
      setToken(data.access_token);
      saveUser(data);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function register(body) {
    setLoading(true);
    try {
      const data = await api.register(body);
      setToken(data.access_token);
      saveUser(data);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuth();
    setUser({});
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);