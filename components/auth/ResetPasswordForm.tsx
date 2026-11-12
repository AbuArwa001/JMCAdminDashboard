"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { ResetPasswordLoading, ResetPasswordError, ResetPasswordSuccess } from "./ResetPasswordStatus";

export function ResetPasswordForm() {
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
    if (!oobCode) { setVerifying(false); setCodeError("No verification security code provided in link."); return; }
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => { setUserEmail(email); setCodeError(null); })
      .catch(() => setCodeError("This security link is invalid or expired. Please request a fresh link."))
      .finally(() => setVerifying(false));
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode!, password);
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch {
      toast.error("Failed to reset password. Security code may have expired.");
    } finally { setSubmitting(false); }
  };

  if (verifying) return <ResetPasswordLoading />;
  if (codeError) return <ResetPasswordError error={codeError} />;
  if (success) return <ResetPasswordSuccess />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {userEmail && <p className="text-xs text-gray-500 text-center">Resetting password for <strong className="text-gray-800">{userEmail}</strong></p>}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Password</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="form-input pl-9 pr-10 text-sm" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm New Password</label>
        <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="form-input text-sm" />
      </div>
      <button type="submit" disabled={submitting} className="w-full btn-primary py-3">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save New Password"}
      </button>
    </form>
  );
}

