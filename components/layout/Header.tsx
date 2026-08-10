"use client";

import { Bell, Menu, Search, LogOut, User as UserIcon, Shield, Command, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 30000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        await logout();
        setShowDropdown(false);
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-40 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick} 
                    className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-500/10 rounded-xl transition-all duration-200"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex flex-col">
                    <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                        Dashboard Overview
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Pro Edition
                        </span>
                    </span>
                    <p className="text-xs text-slate-400 font-medium hidden md:block">
                        Jamia Mosque Committee • Central Management Panel
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Global Search Bar */}
                <div className="relative hidden lg:block">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search drives, donations, donors..."
                        className="pl-10 pr-12 py-2.5 bg-slate-100/80 hover:bg-slate-100 border border-slate-200/90 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 w-72 transition-all shadow-inner text-slate-800 placeholder-slate-400 font-medium"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const target = e.target as HTMLInputElement;
                                window.location.href = `/donations?search=${encodeURIComponent(target.value)}`;
                            }
                        }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-200/70 px-1.5 py-0.5 rounded-md">
                        <Command className="w-2.5 h-2.5" /> K
                    </div>
                </div>

                {/* Clock indicator */}
                {currentTime && (
                    <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs font-semibold text-slate-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {currentTime} EAT
                    </div>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2.5 text-slate-600 hover:text-amber-600 hover:bg-amber-500/10 rounded-2xl transition-all duration-200 border border-transparent hover:border-amber-500/20"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-20"
                                >
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                            Notifications
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 rounded-full">New</span>
                                        </h4>
                                        <button className="text-xs font-semibold text-amber-600 hover:underline">Mark all read</button>
                                    </div>
                                    <div className="py-3 space-y-3">
                                        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                                            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">New Donation Received</p>
                                                <p className="text-[11px] text-slate-500">KES 15,000 received for Education Drive</p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">5 mins ago</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition-colors">
                                            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Friday Khutba Uploaded</p>
                                                <p className="text-[11px] text-slate-500">Ready for broadcasting</p>
                                                <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 p-1.5 pr-3 text-slate-700 hover:bg-slate-100 rounded-2xl transition-all duration-200 border border-slate-200/80 hover:border-amber-500/30 shadow-sm"
                    >
                        <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 rounded-xl flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-amber-500/20">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="hidden md:flex flex-col text-left">
                            <span className="text-xs font-bold text-slate-900 leading-tight">
                                {user?.displayName || user?.email?.split('@')[0] || 'Administrator'}
                            </span>
                            <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                                Executive Admin
                            </span>
                        </div>
                    </button>

                    {/* Dropdown Popover */}
                    <AnimatePresence>
                        {showDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowDropdown(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-20 overflow-hidden"
                                >
                                    <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-slate-100">
                                        <p className="text-sm font-bold text-slate-900">
                                            {user?.displayName || 'Executive Administrator'}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate font-medium mt-0.5">
                                            {user?.email || 'admin@jmc.org'}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                                            <Shield className="w-3 h-3 text-emerald-500" /> Authenticated Session
                                        </div>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <a
                                            href="/settings"
                                            className="w-full px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 transition-colors"
                                        >
                                            <UserIcon className="w-4 h-4 text-slate-500" /> Account & Profile Settings
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2.5 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            Sign Out of Portal
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

