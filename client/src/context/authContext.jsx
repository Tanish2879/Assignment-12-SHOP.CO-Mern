import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const data = localStorage.getItem("auth");
      if (data) {
        const parseData = JSON.parse(data);
        if (parseData?.token) {
          axios.defaults.headers.common["Authorization"] = parseData.token;
        }
        return {
          user: parseData.user || null,
          token: parseData.token || ""
        };
      }
    } catch (e) {
      console.error("Error reading auth from localStorage:", e);
    }
    return {
      user: null,
      token: ""
    };
  });

  // Set default axios authorization header whenever token changes
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = auth.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth
export const useAuth = () => useContext(AuthContext);
