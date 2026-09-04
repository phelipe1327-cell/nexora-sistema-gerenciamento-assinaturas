import { useState, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import type { SystemUser } from "../types/subscription";

const USER_STORAGE_KEY = "auth-user";

function getStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as SystemUser;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<SystemUser | null>(getStoredUser);

  function signIn(newToken: string, authenticatedUser: SystemUser) {
    localStorage.setItem("token", newToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
    setToken(newToken);
    setUser(authenticatedUser);
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: Boolean(token && user), signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
