import React, { createContext, useState, useContext, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem("authToken") || localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedToken =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken) {
      setLoading(false);
      return;
    }
    setToken(storedToken);
    setIsAuthenticated(true);
    if (storedUser) setUser(JSON.parse(storedUser));
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session expired");
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
