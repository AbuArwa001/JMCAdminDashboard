"use client";

import { Bell, Menu, Search, LogOut, User as UserIcon, Shield, Command, CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

// Map routes to readable page titles
const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard Overview",
  "/drives": "Donation Drives",
  "/drives/create": "Create New Drive",
  "/categories": "Categories",
  "/categories/create": "New Category",
  "/donations": "Donations Log",
  "/accounts": "Donors & Accounts",
  "/transfers": "Internal Transfers",
  "/community/darsas": "Darsas & Classes",
  "/community/inspiration": "Inspiration Quote",
  "/community/khutba": "Friday Khutba",
  "/community/events": "Events",
  "/community/duas": "Duas",
  "/community/quran": "Quran",
  "/community/prayer-times": "Prayer Timings",
  "/community/zakat": "Zakat Calculator",
  "/settings": "Portal Settings",
  "/settings/features": "Feature Toggles",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");

  const pageTitle = PAGE_TITLES[pathname] ?? "JMC Portal";

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm flex-shrink-0">
      {/* Left: Menu toggle + Page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:text-[#1a1512] hover:bg-gray-100 rounded-lg transition-all duration-200"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <div>
            <h2 className="font-bold text-base text-gray-900 leading-tight tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              {pageTitle}
            </h2>
            <p className="text-[10px] text-gray-400 font-medium hidden md:block leading-tight">
              Jamia Mosque Committee &bull; Finance &amp; Donation Portal
            </p>
          </div>
        </div>
      </div>

      {/* Right: Search + Clock + Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search donations, drives..."
            className="pl-9 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006838]/30 focus:border-[#006838]/40 w-64 transition-all text-gray-700 placeholder-gray-400 font-medium"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLInputElement;
                window.location.href = `/donations?search=${encodeURIComponent(target.value)}`;
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-gray-400 bg-gray-200/80 px-1.5 py-0.5 rounded">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>

        {/* Clock */}
        {currentTime && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {currentTime} EAT
          </div>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-[#1a1512] hover:bg-gray-100 rounded-xl transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c99335] rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-20"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                    <button className="text-xs font-semibold text-[#006838] hover:underline">Mark all read</button>
                  </div>
                  <div className="py-3 space-y-2.5">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">New Donation Received</p>
                        <p className="text-[11px] text-gray-500">KES 15,000 received for Education Drive</p>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">5 mins ago</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Drive Target Reached</p>
                        <p className="text-[11px] text-gray-500">Ramadhan Food Drive hit 100%</p>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 px-2 py-1.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
          >
            <div className="w-7 h-7 bg-gradient-to-tr from-[#c99335] to-[#e39e3b] rounded-lg flex items-center justify-center font-bold text-[#1a1512] text-xs shadow-sm">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-tight">
                {user?.displayName || user?.email?.split("@")[0] || "Administrator"}
              </span>
              <span className="text-[10px] font-semibold text-[#c99335] uppercase tracking-wider leading-tight">
                Admin
              </span>
            </div>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-[#1a1512]/5 via-[#c99335]/5 to-transparent border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.displayName || "Executive Administrator"}
                    </p>
                    <p className="text-xs text-gray-500 truncate font-medium mt-0.5">
                      {user?.email || "admin@jmc.org"}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                      <Shield className="w-3 h-3 text-emerald-600" /> Authenticated Session
                    </div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <a
                      href="/settings"
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-gray-500" />
                      Account & Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
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
