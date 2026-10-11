"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [verifying, setVerifying] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setVerifying(false);
      setCodeError("No verification security code provided in link.");
      return;
    }

    const verifyCode = async () => {
      try {
        setVerifying(true);
        const email = await verifyPasswordResetCode(auth, oobCode);
        setUserEmail(email);
        setCodeError(null);
      } catch (err: any) {
        console.error("Code verification error:", err);
        const code = err?.code;
        if (code === "auth/expired-action-code") {
          setCodeError("This security link has expired. Please request a new password reset link.");
        } else if (code === "auth/invalid-action-code") {
          setCodeError("This security link has already been used or is invalid.");
        } else {
          setCodeError("Could not verify reset clearance. Please request a fresh link.");
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oobCode) {
      toast.error("Invalid reset code");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (err: any) {
      console.error("Password reset confirmation error:", err);
      toast.error(err?.message || "Failed to reset password. Link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  // State 1: Verifying code
  if (verifying) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#c99335]/20 to-[#e39e3b]/10 animate-pulse border border-[#c99335]/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#c99335] animate-spin" />
          </div>
        </div>
        <h2
          className="text-lg font-bold text-gray-900 tracking-tight"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Validating Security Clearance...
        </h2>
        <p className="text-xs text-gray-400">Verifying one-time reset token with Firebase Auth</p>
      </div>
    );
  }

  // State 2: Invalid or expired code
  if (codeError) {
    return (
      <div className="space-y-6 text-center">
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-700 max-w-sm mx-auto">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
          <h2
            className="text-base font-bold text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Clearance Link Invalid
          </h2>
          <p className="text-xs leading-relaxed text-gray-600">{codeError}</p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/forgot-password"
            className="btn-primary justify-center py-3 text-xs shadow-gold-sm"
          >
            Request Fresh Reset Link
          </Link>
          <Link
            href="/login"
            className="btn-secondary justify-center py-2.5 text-xs text-gray-600"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // State 3: Success state
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 max-w-sm mx-auto">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-600" />
          <h2
            className="text-lg font-bold text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Password Successfully Updated
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Your administrator account credentials have been secured. You can now access the portal.
          </p>
        </div>

        <Link
          href="/login"
          className="btn-primary w-full justify-center py-3.5 text-xs shadow-gold-sm"
        >
          <span>Sign In to Executive Portal</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </motion.div>
    );
  }

  // State 4: Form to set new password
  return (
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
            Set Executive Password
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Setting new credentials for{" "}
            <span className="font-bold text-[#c99335]">{userEmail}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input pl-10 pr-10 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="form-label">Confirm New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input pl-10 text-xs"
            />
          </div>
        </div>

        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-[11px] text-gray-500 space-y-1">
          <p className="font-bold text-gray-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c99335]" /> Security Requirements
          </p>
          <ul className="list-disc pl-4 space-y-0.5 text-gray-500">
            <li>Minimum 6 characters (8+ recommended)</li>
            <li>Passwords must match exactly</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center py-3.5 text-xs shadow-gold-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Credentials...</span>
            </>
          ) : (
            <span>Confirm &amp; Update Password</span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 pt-2">
        Remember your password?{" "}
        <Link href="/login" className="text-[#c99335] hover:underline font-bold">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 text-[#c99335] animate-spin mx-auto" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
