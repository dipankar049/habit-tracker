import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("habit_tracker049_v1_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("habit_tracker049_v1_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_NODE_URI}/auth/verifyToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Invalid token");

        const data = await res.json();

        // Keep user in sync with backend
        setUser(data.user);
        localStorage.setItem("habit_tracker049_v1_user", JSON.stringify(data.user));
      } catch (err) {
        console.log("Token invalid. Logging out...");
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const login = (userData, tokenValue) => {
    localStorage.setItem("habit_tracker049_v1_token", tokenValue);
    localStorage.setItem("habit_tracker049_v1_user", JSON.stringify(userData));
    setUser(userData);
    setToken(tokenValue);
  };

  const logout = () => {
    localStorage.removeItem("habit_tracker049_v1_user");
    localStorage.removeItem("habit_tracker049_v1_token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);