"use client";

import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { checkStaffAccess, finalizeLogin } from "@/lib/auth-helpers";
import { clearAuthStorage } from "@/lib/auth-storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SocialLoginButtons({ isLoading, setIsLoading }: { isLoading: boolean; setIsLoading: (l: boolean) => void }) {
  const router = useRouter();

  const handleProvider = async (provider: any) => {
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken(true);
      const hasAccess = await checkStaffAccess(cred.user, token);
      if (!hasAccess) {
        await auth.signOut();
        clearAuthStorage();
        toast.error("Access denied. Executive administrator or staff privileges required.");
        return;
      }
      finalizeLogin(cred.user, token);
      toast.success("Welcome back! Redirecting...");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" disabled={isLoading} onClick={() => { const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" }); handleProvider(p); }} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50">
        Google
      </button>
      <button type="button" disabled={isLoading} onClick={() => handleProvider(new GithubAuthProvider())} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50">
        GitHub
      </button>
    </div>
  );
}

