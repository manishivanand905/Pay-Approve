import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "paybuild-auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const savedSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (!savedSession) {
        setAuthReady(true);
        return;
      }

      try {
        const session = JSON.parse(savedSession);
        const response = await apiRequest("/auth/me", { token: session.token });

        if (mounted) {
          setToken(session.token);
          setCurrentUser(response.data);
        }
      } catch (error) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        if (mounted) {
          setAuthReady(true);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const persistSession = (sessionToken, user) => {
    setToken(sessionToken);
    setCurrentUser(user);
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: sessionToken,
      })
    );
  };

  const login = async (role, credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: {
        ...credentials,
        role,
      },
    });

    persistSession(response.token, response.data);
    return response.data;
  };

  const signupRequester = async (payload) => {
    const response = await apiRequest("/auth/signup", {
      method: "POST",
      body: payload,
    });

    persistSession(response.token, response.data);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        authReady,
        token,
        currentUser,
        login,
        signupRequester,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
