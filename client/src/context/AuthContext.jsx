import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("rb_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("rb_token");
    if (!token) {
      setReady(true);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data);
        localStorage.setItem("rb_user", JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem("rb_token");
        localStorage.removeItem("rb_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const persist = (data) => {
    localStorage.setItem("rb_token", data.token);
    localStorage.setItem("rb_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persist(data);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persist(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("rb_token");
    localStorage.removeItem("rb_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
