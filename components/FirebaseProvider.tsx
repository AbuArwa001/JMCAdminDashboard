"use client";

import { createContext, useMemo } from "react";
import { User } from "firebase/auth";
import TokenCountdownModal from "@/components/auth/TokenCountdownModal";
import { useAuthSession } from "@/hooks/use-auth-session";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: (reason?: string | React.SyntheticEvent | unknown) => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, refreshToken } = useAuthSession();

  const value = useMemo(
    () => ({ user, loading, logout, refreshToken }),
    [user, loading, logout, refreshToken]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && <TokenCountdownModal />}
    </AuthContext.Provider>
  );
}
