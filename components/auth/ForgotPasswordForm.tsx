"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      const code = error.code;
      let msg = "Failed to send reset email";
      if (code === 'auth/user-not-found') msg = "No account found with this email";
      else if (code === 'auth/invalid-email') msg = "Invalid email address";
      else if (code === 'auth/too-many-requests') msg = "Too many requests. Please try again later";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-800 text-sm">We've sent a password reset link to <strong>{email}</strong></p>
          <p className="text-green-600 text-xs mt-2">Please check your inbox and spam folder</p>
        </div>
        <button onClick={() => router.push('/login')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handlePasswordReset} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          placeholder="admin@jmc.org"
          required
        />
      </div>
      <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-bronze text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center">
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
      </button>
    </form>
  );
}

