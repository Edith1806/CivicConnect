import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session on refresh
  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      setLoading(false);
      return;
    }

    api.post("/auth/refresh", null, {
      params: { refreshToken }
    })
      .then(res => {
        sessionStorage.setItem(
          "accessToken",
          res.data.accessToken
        );
        decodeUser(res.data.accessToken);
      })
      .catch(() => {
        logout();
      })
      .finally(() => setLoading(false));
  }, []);

  const decodeUser = token => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload.sub);
    setRole(payload.role);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    sessionStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    decodeUser(res.data.accessToken);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await api.post("/auth/logout", null, {
        params: { refreshToken }
      });
    }
    sessionStorage.clear();
    localStorage.removeItem("refreshToken");
    setUser(null);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
