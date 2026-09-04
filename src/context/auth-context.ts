import { createContext } from "react";
import type { SystemUser } from "../types/subscription";

export interface AuthContextValue {
  token: string | null;
  user: SystemUser | null;
  isAuthenticated: boolean;
  signIn: (token: string, user: SystemUser) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
