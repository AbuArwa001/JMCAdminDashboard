"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  RotateCcw,
  Trash2,
  DollarSign,
  Radio,
  FileText,
  HeartHandshake,
  Calendar,
  Volume2,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";

export function SettingsNotificationsTab() {
  const {
    notifications,
    unreadCount,
    dismissedCount,
    preferences,
    updatePreferences,
    markAllAsRead,
    clearAllNotifications,
    restoreDismissed,
  } = useAdminNotifications();

  const [permissionState, setPermissionState] = useState<string>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const requestBrowserPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser notifications are not supported in this environment.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setPermissionState(res);
      if (res === "granted") {
        toast.success("Browser push notifications enabled!");
      } else if (res === "denied") {
        toast.error("Notifications blocked in browser settings.");
      }
    } catch {
      toast.error("Could not request notification permissions.");
    }
  };

  const handleToggle = (key: keyof typeof preferences, value: any) => {
    updatePreferences({ [key]: value });
    toast.success("Notification preferences updated");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
          <Bell className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h3
            className="font-bold text-sm tracking-wide text-gray-900"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            Notification Preferences &amp; Feed Management
          </h3>
          <p className="text-[11px] text-gray-400">
            Control personal alert categories, thresholds, and your notification history
          </p>
        </div>
      </div>

      <div className="form-section-body space-y-6">
        {/* Personal Feed Overview & Actions */}
        <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Personal Feed Status
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
              <span>
                <strong className="text-gray-900 font-bold">{notifications.length}</strong> active alerts
              </span>
              <span>&bull;</span>
              <span>
                <strong className="text-[#c99335] font-bold">{unreadCount}</strong> unread
              </span>
              <span>&bull;</span>
              <span>
                <strong className="text-gray-900 font-bold">{dismissedCount}</strong> dismissed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllAsRead();
                  toast.success("All notifications marked as read");
                }}
                className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#006838]" />
                <span>Mark All Read</span>
              </button>
            )}

            {dismissedCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  restoreDismissed();
                  toast.success("Dismissed notifications restored to feed");
                }}
                className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c99335]" />
                <span>Restore ({dismissedCount})</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearAllNotifications();
                  toast.info("Cleared all notifications from your personal feed");
                }}
                className="btn-outline text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 hover:border-red-200 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Alert Categories */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Alert Categories
          </h4>

          {/* 1. Donations & Treasury Alerts */}
          <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006838] flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Donations &amp; Treasury Alerts</p>
                  <p className="text-[11px] text-gray-500">
                    Receive alerts when new donations arrive into Jamia Mosque accounts
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.donations}
                  onChange={(e) => handleToggle("donations", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006838]" />
              </label>
            </div>

            {preferences.donations && (
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-gray-500 font-medium">Minimum Notification Amount:</span>
                <select
                  value={preferences.donationMinAmount}
                  onChange={(e) => handleToggle("donationMinAmount", Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c99335]"
                >
                  <option value={0}>All Donations (Any amount)</option>
                  <option value={1000}>KES 1,000 and above</option>
                  <option value={5000}>KES 5,000 and above</option>
                  <option value={10000}>KES 10,000 and above (Executive default)</option>
                  <option value={50000}>KES 50,000 and above (Major gifts only)</option>
                  <option value={100000}>KES 100,000 and above</option>
                </select>
              </div>
            )}
          </div>

          {/* 2. Friday Khutba */}
          <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#c99335] flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Friday Khutba Notifications</p>
                <p className="text-[11px] text-gray-500">
                  Weekly Khutba titles, guest speakers, sermon recordings &amp; summaries
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.khutba}
                onChange={(e) => handleToggle("khutba", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006838]" />
            </label>
          </div>

          {/* 3. Friday Bulletins */}
          <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Friday Bulletins</p>
                <p className="text-[11px] text-gray-500">
                  Official weekly bulletin publications and committee announcements
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.bulletins}
                onChange={(e) => handleToggle("bulletins", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006838]" />
            </label>
          </div>

          {/* 4. Donation Drives & Urgent Appeals */}
          <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Donation Drives &amp; Campaigns</p>
                <p className="text-[11px] text-gray-500">
                  New fundraising campaigns, target progress, and milestone alerts
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.drives}
                onChange={(e) => handleToggle("drives", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006838]" />
            </label>
          </div>

          {/* 5. Community Content & Events */}
          <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Community Programs &amp; Events</p>
                <p className="text-[11px] text-gray-500">
                  Darsas, Islamic seminars, Ramadan programs, and daily Dua releases
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.community}
                onChange={(e) => handleToggle("community", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006838]" />
            </label>
          </div>
        </div>

        {/* Browser Push Notifications */}
        <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Browser Push Notifications</p>
                <p className="text-[11px] text-gray-500">
                  Receive instant desktop popups for critical alerts via Firebase Cloud Messaging
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  permissionState === "granted"
                    ? "bg-emerald-100 text-emerald-800"
                    : permissionState === "denied"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {permissionState}
              </span>

              {permissionState !== "granted" && (
                <button
                  type="button"
                  onClick={requestBrowserPermission}
                  className="btn-primary text-xs py-1 px-3"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
