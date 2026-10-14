"use client";

import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { auth } from "@/lib/firebase";
import {
  onIdTokenChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import TokenCountdownModal from "@/components/auth/TokenCountdownModal";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: (reason?: string | React.SyntheticEvent | unknown) => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export default function FirebaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Helper to disable Firebase's silent background token refresher.
  // This ensures the admin is explicitly warned via the countdown modal
  // before their token expires, enforcing strict security timeout.
  const disableProactiveRefresh = useCallback(() => {
    if (typeof (auth as any)._stopProactiveRefresh === "function") {
      try {
        (auth as any)._stopProactiveRefresh();
      } catch (err) {
        console.warn("Could not stop proactive refresh:", err);
      }
    }
  }, []);

  const logout = useCallback(async (reason?: string | React.SyntheticEvent | unknown) => {
    try {
      await firebaseSignOut(auth);
      Cookies.remove("firebaseToken");
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("firebaseUser");
      setUser(null);
      if (typeof reason === "string" && reason === "session_expired") {
        router.push("/login?error=session_expired");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [router]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      // Force refresh of Firebase ID Token
      const token = await currentUser.getIdToken(true);

      Cookies.set("firebaseToken", token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      localStorage.setItem("firebaseToken", token);
      localStorage.setItem("session_refreshed_at", Date.now().toString());

      disableProactiveRefresh();
      return token;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }, [disableProactiveRefresh]);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      // 1. Only update state if the UID actually changed to avoid re-render loops
      if (currentUser?.uid !== user?.uid) {
        setUser(currentUser);
      }

      if (currentUser) {
        const token = await currentUser.getIdToken();
        // 2. Only set cookie if it's different or missing
        const existingToken = Cookies.get("firebaseToken");
        if (existingToken !== token) {
          Cookies.set("firebaseToken", token, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          localStorage.setItem("firebaseToken", token);
        }
        disableProactiveRefresh();
      } else {
        if (Cookies.get("firebaseToken")) {
          Cookies.remove("firebaseToken");
          localStorage.removeItem("firebaseToken");
          localStorage.removeItem("firebaseUser");
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, disableProactiveRefresh]);

  // 3. Memoize the value to prevent child re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
      refreshToken,
    }),
    [user, loading, logout, refreshToken],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && <TokenCountdownModal />}
    </AuthContext.Provider>
  );
}
