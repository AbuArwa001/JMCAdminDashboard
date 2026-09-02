"use client";

import { useEffect, useState } from "react";
import { Save, User, Lock, Bell, Shield, Settings } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { getMe, updateMe } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isFetching, setIsFetching] = useState(true);
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
        setFormData((prev) => ({
          ...prev,
          userId: userData.id || "",
          name: userData.full_name || "Admin User",
          email: userData.email || "admin@jmc.org",
          phone: userData.phone_number || "+254 700 000000",
        }));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMe({
        id: formData.userId,
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
      });
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings.");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Portal Settings
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Manage your account preferences and security configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3 space-y-3">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#c99335] to-[#e39e3b] flex items-center justify-center text-[#1a1512] font-bold text-lg shadow-md">
                {formData.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{formData.name}</p>
                <p className="text-xs text-gray-400 truncate">{formData.email}</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                  <Shield className="w-2.5 h-2.5" /> Administrator
                </span>
              </div>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-[#1a1512] text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <tab.icon className={clsx("w-4 h-4", isActive ? "text-[#c99335]" : "text-gray-400")} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9">
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
                    <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                      Profile Information
                    </h3>
                    <p className="text-[11px] text-gray-400">Update your personal details and contact info</p>
                  </div>
                </div>
                <div className="form-section-body">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      <div>
                        <label className="form-label">Email Address</label>
                        {isFetching ? (
                          <Skeleton className="h-11 w-full rounded-xl" />
                        ) : (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="you@example.com"
                          />
                        )}
                      </div>
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
                      <button type="submit" disabled={isFetching} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <>
                <div className="form-section-header">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                      Security Settings
                    </h3>
                    <p className="text-[11px] text-gray-400">Manage your password and account security</p>
                  </div>
                </div>
                <div className="form-section-body">
                  <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                    {[
                      { name: "currentPassword", label: "Current Password" },
                      { name: "newPassword", label: "New Password" },
                      { name: "confirmPassword", label: "Confirm New Password" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="form-label">{field.label}</label>
                        <input
                          type="password"
                          name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="••••••••"
                        />
                      </div>
                    ))}

                    {/* Password Strength Info */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs font-bold text-amber-700 mb-2">Password Requirements</p>
                      <ul className="text-xs text-amber-600 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Contains uppercase and lowercase letters</li>
                        <li>• Contains at least one number or symbol</li>
                      </ul>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                      <button type="submit" className="btn-primary">
                        <Shield className="w-4 h-4" /> Update Password
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
                    <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
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
                    Notification preferences will be configurable in a future portal update.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
