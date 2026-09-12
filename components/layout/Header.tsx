"use client";

import { Bell, Menu, Search, LogOut, User as UserIcon, Shield, Command, CheckCircle2, Sparkles, Mic, CalendarDays, Newspaper, Heart, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

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

interface NotificationLog {
  id: number;
  title: string;
  body: string;
  image_url?: string | null;
  notification_type?: string | null;
  sent_at: string;
  recipient_count: number;
}

const LAST_READ_KEY = "jmc_notif_last_read";

function NotifIcon({ type }: { type?: string | null }) {
  switch (type) {
    case "khutba":
      return <div className="p-2 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0"><Mic className="w-4 h-4" /></div>;
    case "event":
      return <div className="p-2 bg-sky-50 text-sky-600 rounded-lg flex-shrink-0"><CalendarDays className="w-4 h-4" /></div>;
    case "bulletin":
      return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0"><Newspaper className="w-4 h-4" /></div>;
    case "donation":
      return <div className="p-2 bg-rose-50 text-rose-600 rounded-lg flex-shrink-0"><Heart className="w-4 h-4" /></div>;
    case "admin_donation":
      return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></div>;
    default:
      return <div className="p-2 bg-purple-50 text-purple-600 rounded-lg flex-shrink-0"><Sparkles className="w-4 h-4" /></div>;
  }
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

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

  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifs(true);
      const res = await api.get("/api/v1/khutba/logs?limit=30");
      const data: NotificationLog[] = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];
      setNotifications(data);

      // Compute unread count using last-read timestamp
      const lastReadStr = localStorage.getItem(LAST_READ_KEY);
      const lastRead = lastReadStr ? new Date(lastReadStr) : new Date(0);
      const unread = data.filter((n) => new Date(n.sent_at) > lastRead).length;
      setUnreadCount(unread);
    } catch {
      // silently fail — don't break the UI
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  // Initial fetch + poll every 60s
  useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, 60_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchNotifications]);

  const handleOpenNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      // Mark all as read
      localStorage.setItem(LAST_READ_KEY, new Date().toISOString());
      setUnreadCount(0);
    }
  };

  const handleMarkAllRead = () => {
    localStorage.setItem(LAST_READ_KEY, new Date().toISOString());
    setUnreadCount(0);
  };

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
            onClick={handleOpenNotifications}
            className="relative p-2 text-gray-500 hover:text-[#1a1512] hover:bg-gray-100 rounded-xl transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#c99335] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
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
                  className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#c99335] text-white rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-[#006838] hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                    {loadingNotifs && notifications.length === 0 ? (
                      <div className="py-10 text-center text-xs text-gray-400 font-medium">
                        Loading notifications…
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const lastReadStr = typeof window !== "undefined" ? localStorage.getItem(LAST_READ_KEY) : null;
                        const lastRead = lastReadStr ? new Date(lastReadStr) : new Date(0);
                        const isUnread = new Date(notif.sent_at) > lastRead;
                        return (
                          <div
                            key={notif.id}
                            className={`flex items-start gap-3 px-4 py-3 transition-colors ${isUnread ? "bg-amber-50/40" : "hover:bg-gray-50"}`}
                          >
                            <NotifIcon type={notif.notification_type} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">{notif.title}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {formatDistanceToNow(new Date(notif.sent_at), { addSuffix: true })}
                              </span>
                            </div>
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-[#c99335] flex-shrink-0 mt-1" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60 text-center">
                      <span className="text-[11px] text-gray-400 font-medium">
                        Showing last {notifications.length} notifications
                      </span>
                    </div>
                  )}
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
                      Account &amp; Profile
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
