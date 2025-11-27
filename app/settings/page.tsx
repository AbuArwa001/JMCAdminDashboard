"use client";

import { useState } from "react";
import { Save, User, Lock, Bell, Shield } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({
        name: "Admin User",
        email: "admin@jmc.org",
        phone: "+254 700 000000",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Settings updated successfully!");
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences and security.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                activeTab === tab.id
                                    ? "bg-white text-primary shadow-sm border border-gray-100"
                                    : "text-gray-600 hover:bg-gray-100/50"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="md:col-span-9">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        {activeTab === "profile" && (
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white shadow-sm">
                                        {formData.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                                        <p className="text-sm text-gray-500">Administrator</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors font-medium shadow-sm hover:shadow"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors font-medium shadow-sm hover:shadow"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="p-6 md:p-8 text-center py-20">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                                <p className="text-gray-500">Notification settings coming soon.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
