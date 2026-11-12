import { useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged, signOut, User } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { storeAuthToken, clearAuthStorage } from "@/lib/auth-storage";

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async (reason?: unknown) => {
    try {
      await signOut(auth);
      clearAuthStorage();
      setUser(null);
      router.push(reason === "session_expired" ? "/login?error=session_expired" : "/login");
    } catch (e) { console.error("Logout error:", e); }
  }, [router]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      const token = await currentUser.getIdToken(true);
      storeAuthToken(token);
      localStorage.setItem("session_refreshed_at", Date.now().toString());
      return token;
    } catch { return null; }
  }, []);

  useEffect(() => onIdTokenChanged(auth, async (u) => {
    if (u?.uid !== user?.uid) setUser(u);
    if (u) {
      const token = await u.getIdToken();
      if (Cookies.get("firebaseToken") !== token) storeAuthToken(token);
    } else if (Cookies.get("firebaseToken")) clearAuthStorage();
    setLoading(false);
  }), [user?.uid]);

  return { user, loading, logout, refreshToken };
}
