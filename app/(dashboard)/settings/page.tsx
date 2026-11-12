"use client";

import { useEffect, useState } from "react";
import {
  Save,
  User,
  Lock,
  Bell,
  Shield,
  Settings,
  Crown,
  KeyRound,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { getMe, updateMe } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import { useRBAC } from "@/hooks/useRBAC";
import Link from "next/link";

export default function SettingsPage() {
  const { staffUser, isSuperAdmin, permissions, hasPermission } = useRBAC();

  const [activeTab, setActiveTab] = useState("profile");
  const [isFetching, setIsFetching] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Email change security re-authentication state
  const [initialEmail, setInitialEmail] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    userId: "",
    name: "Admin User",
    email: "admin@jmc.org",
    phone: "+254 700 000000",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsFetching(true);
        const userData = await getMe();
        const resolvedEmail = userData.email || staffUser?.email || "admin@jmc.org";
        setInitialEmail(resolvedEmail);
        setFormData((prev) => ({
          ...prev,
          userId: userData.id || "",
          name: userData.full_name || staffUser?.full_name || "Admin User",
          email: resolvedEmail,
          phone: userData.phone_number || staffUser?.phone_number || "+254 700 000000",
        }));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, [staffUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isEmailChanged =
    initialEmail !== "" &&
    formData.email.trim().toLowerCase() !== initialEmail.trim().toLowerCase();

  // Handle standard Profile Save
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If the email address has been modified, enforce secure authorization
    if (isEmailChanged) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error("Please enter a valid email address.");
        return;
      }
      setAuthError(null);
      setAuthPassword("");
      setIsEmailModalOpen(true);
      return;
    }

    // Otherwise, save standard profile details
    setIsSavingProfile(true);
    try {
      await updateMe({
        full_name: formData.name,
        phone_number: formData.phone,
      });
      toast.success("Profile details updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile settings.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle secure Email change after password confirmation
  const handleAuthorizeEmailChange = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!authPassword) {
      setAuthError("Please enter your current password to authorize this change.");
      return;
    }

    const trimmedNewEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedNewEmail)) {
      setAuthError("Invalid email format. Please check the spelling.");
      return;
    }

    setIsSubmittingEmail(true);
    setAuthError(null);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No active Firebase session found. Please log in again.");
      }

      // 1. Re-authenticate with Firebase using current credentials
      const credential = EmailAuthProvider.credential(
        currentUser.email || initialEmail,
        authPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // 2. Obtain fresh ID Token with updated auth_time
      const freshToken = await currentUser.getIdToken(true);

      // 3. Request administrative update via Next.js server route
      const response = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify({
          newEmail: trimmedNewEmail,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update email.");
      }

      // 4. Force token refresh on client to receive the new email claims
      const updatedToken = await currentUser.getIdToken(true);

      // 5. Update browser cookies & storage
      Cookies.set("firebaseToken", updatedToken, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      localStorage.setItem("firebaseToken", updatedToken);

      const storedUser = localStorage.getItem("firebaseUser");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          parsed.email = trimmedNewEmail;
          localStorage.setItem("firebaseUser", JSON.stringify(parsed));
        } catch (err) {}
      }

      // 6. Synchronize name, phone, and new email with backend database
      try {
        await updateMe({
          full_name: formData.name,
          phone_number: formData.phone,
          email: trimmedNewEmail,
        });
      } catch (dbErr) {
        console.warn("Backend user profile sync notice:", dbErr);
      }

      // 7. Update state and notify user
      setInitialEmail(trimmedNewEmail);
      setFormData((prev) => ({ ...prev, email: trimmedNewEmail }));
      setIsEmailModalOpen(false);
      setAuthPassword("");
      toast.success(`Email successfully updated to ${trimmedNewEmail}!`);
    } catch (err: any) {
      console.error("Email update failed:", err);
      const code = err.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setAuthError("Incorrect password. Please verify and try again.");
      } else if (code === "auth/too-many-requests") {
        setAuthError("Too many failed attempts. Please wait a few moments before trying again.");
      } else {
        setAuthError(err.message || "Failed to update email address.");
      }
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // Handle Password Update on the Security Tab
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please enter and confirm your new password.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No active session found.");

      const credential = EmailAuthProvider.credential(
        currentUser.email || initialEmail,
        formData.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, formData.newPassword);

      toast.success("Password updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        toast.error("Incorrect current password.");
      } else {
        toast.error(err.message || "Failed to update password.");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "clearance", label: "Security Clearance", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const roleName = staffUser?.role?.role_name || (isSuperAdmin ? "Super Admin" : "Staff Administrator");
  const roleColor = staffUser?.role?.color || (isSuperAdmin ? "#c99335" : "#10b981");

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h1
            className="text-2xl font-bold text-[#1a1512] tracking-tight"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Portal Settings
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Manage your account preferences, credentials, and verify your role permissions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 space-y-3">
          {/* Avatar Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#1a1512] font-bold text-lg shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${roleColor}, #c99335)`,
                }}
              >
                {formData.name.charAt(0)}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{formData.name}</p>
                <p className="text-xs text-gray-400 truncate font-mono">{formData.email}</p>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border"
                  style={{
                    backgroundColor: `${roleColor}15`,
                    borderColor: `${roleColor}40`,
                    color: roleColor,
                  }}
                >
                  {isSuperAdmin ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  <span>{roleName}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-2xl transition-all duration-200",
                    isActive
                      ? "bg-[#1a1512] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <tab.icon
                    className={clsx("w-4 h-4", isActive ? "text-[#c99335]" : "text-gray-400")}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Super Admin Quick Links Card */}
          {(isSuperAdmin || hasPermission("users.manage") || hasPermission("roles.manage")) && (
            <div className="p-4 bg-gradient-to-br from-[#1a1512] to-[#251d18] rounded-3xl text-white shadow-md border border-[#c99335]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#c99335]">
                <Crown className="w-4 h-4" />
                <span>Executive Management</span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                You have elevated privileges to configure access tiers and manage users.
              </p>
              <div className="space-y-1.5 pt-1">
                {(isSuperAdmin || hasPermission("users.manage")) && (
                  <Link
                    href="/users"
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#c99335]" />
                      Manage Staff
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </Link>
                )}
                {(isSuperAdmin || hasPermission("roles.manage")) && (
                  <Link
                    href="/roles"
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-3.5 h-3.5 text-[#c99335]" />
                      Roles Matrix
                    </span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="form-section"
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <div className="form-section-header">
                  <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#c99335]" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-sm tracking-wide"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      Profile Information
                    </h3>
                    <p className="text-[11px] text-gray-400">Update your personal details and contact info</p>
                  </div>
                </div>
                <div className="form-section-body">
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div>
                        <label className="form-label">Full Name</label>
                        {isFetching ? (
                          <Skeleton className="h-11 w-full rounded-xl" />
                        ) : (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Your full name"
                          />
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="form-label mb-0">Email Address</label>
                          {isEmailChanged && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <ShieldAlert className="w-3 h-3 text-amber-600" />
                              Verification Required
                            </span>
                          )}
                        </div>

                        {isFetching ? (
                          <Skeleton className="h-11 w-full rounded-xl" />
                        ) : (
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={clsx(
                                "form-input",
                                isEmailChanged &&
                                  "border-amber-400 focus:border-amber-500 focus:ring-amber-500/20 pr-24"
                              )}
                              placeholder="you@example.com"
                            />
                            {isEmailChanged && (
                              <button
                                type="button"
                                onClick={() => {
                                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                  if (!emailRegex.test(formData.email.trim())) {
                                    toast.error("Please enter a valid email address.");
                                    return;
                                  }
                                  setAuthError(null);
                                  setAuthPassword("");
                                  setIsEmailModalOpen(true);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1512] hover:bg-[#2d2520] text-[#c99335] text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Lock className="w-3 h-3" />
                                Verify
                              </button>
                            )}
                          </div>
                        )}

                        {isEmailChanged ? (
                          <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                            <span>
                              Original: <strong className="font-mono text-gray-700">{initialEmail}</strong>. Save or click Verify to authorize change.
                            </span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-gray-400 mt-1">
                            Primary sign-in credential. Modifying this requires password authorization.
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="form-label">Phone Number</label>
                        {isFetching ? (
                          <Skeleton className="h-11 w-full rounded-xl" />
                        ) : (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="+254 700 000000"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={isSavingProfile || isFetching}
                        className="btn-primary"
                      >
                        {isSavingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Save Profile Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Security Clearance Tab */}
            {activeTab === "clearance" && (
              <>
                <div className="form-section-header">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-sm tracking-wide"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      Active Security Clearance
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Role-based access controls and permissions assigned to your account
                    </p>
                  </div>
                </div>

                <div className="form-section-body space-y-6">
                  {/* Role Card Banner */}
                  <div
                    className="p-5 rounded-2xl border flex items-start gap-4"
                    style={{
                      backgroundColor: `${roleColor}10`,
                      borderColor: `${roleColor}30`,
                    }}
                  >
                    <div
                      className="p-3 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${roleColor}25`,
                        color: roleColor,
                      }}
                    >
                      {isSuperAdmin ? <Crown className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-gray-900">{roleName}</h4>
                        {isSuperAdmin && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1a1512] text-[#c99335] px-2 py-0.5 rounded-full">
                            Full Root Clearance
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {staffUser?.role?.description ||
                          (isSuperAdmin
                            ? "Unrestricted administrative clearance across all treasury, community, content, and system configuration modules."
                            : "Standard administrative privileges assigned by the Executive Committee.")}
                      </p>
                    </div>
                  </div>

                  {/* Permissions List */}
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Granted Module Permissions ({isSuperAdmin ? "All (*)" : permissions.length})
                    </h5>

                    {isSuperAdmin ? (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#c99335] flex-shrink-0" />
                        <span>
                          As a Super Administrator, you automatically possess wildcard clearance across every section, API endpoint, and management capability.
                        </span>
                      </div>
                    ) : permissions.length === 0 ? (
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs italic">
                        No specific module permissions assigned. Contact your Super Administrator.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {permissions.map((p) => (
                          <div
                            key={p}
                            className="p-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2 text-xs font-semibold text-gray-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{p}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <>
                <div className="form-section-header">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-sm tracking-wide"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      Security &amp; Password
                    </h3>
                    <p className="text-[11px] text-gray-400">Update your access password and session credentials</p>
                  </div>
                </div>
                <div className="form-section-body">
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                      <div key={field}>
                        <label className="form-label">
                          {field === "currentPassword"
                            ? "Current Password"
                            : field === "newPassword"
                            ? "New Password"
                            : "Confirm New Password"}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords[field] ? "text" : "password"}
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleChange}
                            className="form-input pr-10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords((prev) => ({
                                ...prev,
                                [field]: !prev[field],
                              }))
                            }
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                            aria-label={showPasswords[field] ? "Hide password" : "Show password"}
                          >
                            {showPasswords[field] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs font-bold text-amber-700 mb-2">Password Requirements</p>
                      <ul className="text-xs text-amber-600 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Contains at least one number or symbol</li>
                      </ul>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="btn-primary"
                      >
                        {isUpdatingPassword ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating Password...</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4" />
                            <span>Update Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <>
                <div className="form-section-header">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-sm tracking-wide"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      Notification Preferences
                    </h3>
                    <p className="text-[11px] text-gray-400">Control alerts and system notifications</p>
                  </div>
                </div>
                <div className="form-section-body text-center py-16">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-7 h-7 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">You&apos;re all caught up!</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Notification preferences are active with Firebase Cloud Messaging (FCM).
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Security Re-Authentication Modal for Changing Email */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className="text-base font-bold text-gray-900"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      Authorize Email Change
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Primary sign-in credential security verification
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    setAuthPassword("");
                    setAuthError(null);
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email Diff Display */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Current Email:</span>
                  <span className="font-mono text-gray-700 line-through">{initialEmail}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> New Email:
                  </span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {formData.email.trim().toLowerCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Changing your email updates your login credentials across the executive portal and Firebase. Please enter your <strong>current password</strong> to authorize this change.
              </p>

              {/* Password Input Form */}
              <form onSubmit={handleAuthorizeEmailChange} className="space-y-4">
                <div>
                  <label className="form-label text-xs">Current Password</label>
                  <div className="relative">
                    <input
                      type={showAuthPassword ? "text" : "password"}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="form-input pr-10 text-sm"
                      placeholder="Enter your current password"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                      {showAuthPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailModalOpen(false);
                      setAuthPassword("");
                      setAuthError(null);
                    }}
                    disabled={isSubmittingEmail}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEmail || !authPassword}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#006838] hover:bg-[#00552e] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmittingEmail ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorize &amp; Update</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
