"use client";

import { useEffect, useState } from "react";
import { Save, User, Lock, Bell, Shield } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { getMe, updateMe } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";

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
        setFormData({
          userId: userData.id || "",
          name: userData.full_name || "Admin User",
          email: userData.email || "admin@jmc.org",
          phone: userData.phone_number || "+254 700 000000",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
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
    const filledData: any = {
      id: formData.userId,
      full_name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
    };
    await updateMe(filledData);
    alert("Settings updated successfully!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-dark tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account preferences and security configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {formData.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {formData.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {formData.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <tab.icon
                  className={clsx(
                    "w-4 h-4",
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-600",
                  )}
                />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 overflow-hidden"
          >
            {activeTab === "profile" && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  Update your personal details and contact info.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      {isFetching ? (
                        <Skeleton className="h-11 w-full rounded-xl" />
                      ) : (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Email Address
                      </label>
                      {isFetching ? (
                        <Skeleton className="h-11 w-full rounded-xl" />
                      ) : (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      {isFetching ? (
                        <Skeleton className="h-11 w-full rounded-xl" />
                      ) : (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={isFetching}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-bronze text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-0.5 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  Security Settings
                </h2>
                <p className="text-sm text-gray-500 mb-8">
                  Manage your password and account security.
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="max-w-md space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-bronze text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-0.5 font-bold text-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-8 text-center py-24">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Notifications
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  You're all caught up! Notification preferences will be
                  available in a future update.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
