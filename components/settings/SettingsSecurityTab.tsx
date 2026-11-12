import { useState } from "react";
import { Lock, Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { toast } from "sonner";

interface Props {
  initialEmail: string;
}

export function SettingsSecurityTab({ initialEmail }: Props) {
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword) { toast.error("Please enter current password."); return; }
    if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) { toast.error("Passwords must match."); return; }
    if (passwords.newPassword.length < 8) { toast.error("Password must be at least 8 characters long."); return; }

    setIsUpdating(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No active session.");
      const cred = EmailAuthProvider.credential(user.email || initialEmail, passwords.currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, passwords.newPassword);
      toast.success("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.code === "auth/wrong-password" ? "Incorrect password." : err.message || "Failed to update.");
    } finally { setIsUpdating(false); }
  };

  return (
    <>
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center"><Lock className="w-4 h-4 text-amber-500" /></div>
        <div><h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Security &amp; Password</h3><p className="text-[11px] text-gray-400">Update your access password and session credentials</p></div>
      </div>
      <div className="form-section-body">
        <form onSubmit={handleSubmit} className="space-y-5">
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => (
            <div key={field}>
              <label className="form-label">{field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}</label>
              <div className="relative">
                <input type={showPasswords[field] ? "text" : "password"} value={passwords[field]} onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })} className="form-input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPasswords((p) => ({ ...p, [field]: !p[field] }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPasswords[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-600">
            <p className="font-bold text-amber-700 mb-1">Requirements: At least 8 characters, uppercase, lowercase, number/symbol.</p>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isUpdating} className="btn-primary">
              {isUpdating ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Updating...</span></> : <><Shield className="w-4 h-4" /><span>Update Password</span></>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

