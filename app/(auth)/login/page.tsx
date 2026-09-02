"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Mail, Lock, LogIn, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle session expired error
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "session_expired") {
      Cookies.remove("firebaseToken");
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("firebaseUser");
      auth.signOut();
      toast.error("Session expired. Please log in again.");
      router.replace("/login");
    }
  }, [router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim();
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin === true || user.email === "admin@jmc.org";

      if (!isAdmin) {
        await auth.signOut();
        toast.error("Access denied. Executive administrator privileges required.");
        setIsLoading(false);
        return;
      }

      const firebaseToken = await user.getIdToken();

      Cookies.set("firebaseToken", firebaseToken, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      localStorage.setItem("firebaseToken", firebaseToken);
      localStorage.setItem("firebaseUser", JSON.stringify(user));

      setLoginSuccess(true);
      toast.success("Welcome back! Redirecting to dashboard...");

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Login error:", error);
      const errorCode = error.code;

      let userFriendlyError = "Invalid login credentials";
      if (errorCode === "auth/user-not-found") {
        userFriendlyError = "No account found with this email";
      } else if (errorCode === "auth/wrong-password") {
        userFriendlyError = "Incorrect password";
      } else if (errorCode === "auth/invalid-email") {
        userFriendlyError = "Invalid email format";
      } else if (errorCode === "auth/too-many-requests") {
        userFriendlyError = "Too many failed attempts. Please try again later";
      }

      toast.error(userFriendlyError);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <>
      {/* Fullscreen Authenticating Modal */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1512]/90 backdrop-blur-md text-white"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center p-8 bg-[#120e0c] rounded-3xl border border-[#c99335]/30 shadow-2xl"
            >
              <div className="relative w-24 h-24 mb-6">
                <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" />
                <div className="absolute inset-0 border-4 border-[#c99335] border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                Authenticating Session...
              </h2>
              <p className="text-sm text-[#c99335] font-medium">Jamia Mosque Executive Admin Portal</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto rounded-2xl bg-[#1a1512] p-3 border border-[#c99335]/40 shadow-lg flex items-center justify-center">
            <Image src="/logo.png" alt="JMC Logo" fill className="object-contain p-2" priority />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Executive Sign In
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Enter your credentials to access the administration portal
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-10"
                placeholder="admin@jmc.org"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="form-label mb-0">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#c99335] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary justify-center py-3.5 text-base shadow-lg shadow-[#006838]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying Session...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In to Portal
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-gray-50 text-gray-400 font-bold uppercase tracking-wider">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="btn-secondary justify-center py-2.5 text-xs text-gray-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            className="btn-secondary justify-center py-2.5 text-xs text-gray-700"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-500 pt-2">
          Need portal access?{" "}
          <Link href="/signup" className="text-[#c99335] hover:underline font-bold">
            Request Administrator Account
          </Link>
        </p>
      </div>
    </>
  );
}
