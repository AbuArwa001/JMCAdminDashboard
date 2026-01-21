"use client";

import { createContext, useEffect, useState, useMemo } from "react";
import { auth } from "@/lib/firebase";
import {
  onIdTokenChanged,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
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
        }
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
  }, [user?.uid]); // Add user.uid to dependencies

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      Cookies.remove("firebaseToken");
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("firebaseUser");
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 3. Memoize the value to prevent child re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
