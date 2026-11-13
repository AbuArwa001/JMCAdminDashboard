"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { checkStaffAccess, finalizeLogin, mapFirebaseAuthError } from "@/lib/auth-helpers";
import { clearAuthStorage } from "@/lib/auth-storage";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await cred.user.getIdToken();
      const hasAccess = await checkStaffAccess(cred.user, token);
      if (!hasAccess) {
        await auth.signOut();
        clearAuthStorage();
        toast.error("Access denied. Executive administrator or staff privileges required.");
        return;
      }
      finalizeLogin(cred.user, token);
      toast.success("Welcome back! Redirecting to dashboard...");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(mapFirebaseAuthError(err?.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@jmc.org" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c99335]/30 focus:border-[#c99335] outline-none" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs font-semibold text-[#c99335] hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c99335]/30 focus:border-[#c99335] outline-none" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#1a1512] hover:bg-[#2d2520] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#c99335]" /> : <><LogIn className="w-4 h-4 text-[#c99335]" /> Enter Executive Portal</>}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/80" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
          <span className="bg-white px-3 text-gray-400">Or continue with</span>
        </div>
      </div>
      <SocialLoginButtons isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}

