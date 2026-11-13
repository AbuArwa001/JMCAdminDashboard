"use client";

import { useState } from "react";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { checkStaffAccess, finalizeLogin } from "@/lib/auth-helpers";
import { clearAuthStorage } from "@/lib/auth-storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GoogleIcon, GithubIcon } from "./SocialBrandIcons";

interface Props {
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
}

const btnClass =
  "group relative w-full flex items-center justify-center gap-2.5 h-11 px-4 bg-white " +
  "hover:bg-neutral-50/80 border border-gray-200/90 hover:border-[#c99335]/60 hover:ring-2 " +
  "hover:ring-[#c99335]/10 rounded-xl font-sans text-xs font-semibold tracking-wide text-gray-700 " +
  "hover:text-gray-900 shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 " +
  "active:translate-y-0 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none";

export function SocialLoginButtons({ isLoading, setIsLoading }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<"google" | "github" | null>(null);

  const handleProvider = async (provider: any, name: "google" | "github") => {
    setIsLoading(true);
    setActive(name);
    try {
      const cred = await signInWithPopup(auth, provider);
      const token = await cred.user.getIdToken(true);
      if (!(await checkStaffAccess(cred.user, token))) {
        await auth.signOut();
        clearAuthStorage();
        toast.error("Access denied. Executive privileges required.");
        return;
      }
      finalizeLogin(cred.user, token);
      toast.success("Welcome back! Redirecting...");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error("Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setActive(null);
    }
  };

  const handleGoogle = () => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    handleProvider(p, "google");
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <button type="button" disabled={isLoading} onClick={handleGoogle} aria-label="Sign in with Google" className={btnClass}>
        {active === "google" ? <Loader2 className="w-4 h-4 animate-spin text-[#c99335]" /> : <GoogleIcon className="w-4 h-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-200" />}
        <span>Google</span>
      </button>
      <button type="button" disabled={isLoading} onClick={() => handleProvider(new GithubAuthProvider(), "github")} aria-label="Sign in with GitHub" className={btnClass}>
        {active === "github" ? <Loader2 className="w-4 h-4 animate-spin text-[#c99335]" /> : <GithubIcon className="w-4 h-4 flex-shrink-0 text-gray-800 group-hover:scale-105 group-hover:text-gray-950 transition-all duration-200" />}
        <span>GitHub</span>
      </button>
    </div>
  );
}
