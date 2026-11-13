"use client";

import { useState } from "react";
import { Bell, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";
import { NotificationsDropdownHeader } from "./NotificationsDropdownHeader";
import { NotificationsDropdownItem } from "./NotificationsDropdownItem";

export function NotificationsDropdown() {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const {
    notifications, displayNotifications, unreadCount, dismissedCount, loading,
    markAsRead, toggleRead, markAllAsRead, dismissNotification, clearAllNotifications, restoreDismissed,
  } = useAdminNotifications();

  const items = filter === "unread" ? notifications.filter((n) => !n.isRead).slice(0, 5) : displayNotifications;

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative p-2 text-gray-500 hover:text-[#1a1512] hover:bg-gray-100 rounded-xl transition-all" aria-label="Notifications">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[#c99335] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {show && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShow(false)} />
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} className="absolute right-0 mt-2 w-96 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-30 overflow-hidden">
              <NotificationsDropdownHeader
                unreadCount={unreadCount} totalCount={notifications.length} dismissedCount={dismissedCount}
                filter={filter} onFilterChange={setFilter} onMarkAllRead={markAllAsRead}
                onClearAll={clearAllNotifications} onRestore={restoreDismissed} onClose={() => setShow(false)}
              />
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                {loading && notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-400 font-medium">Loading notifications…</div>
                ) : items.length === 0 ? (
                  <div className="py-10 text-center px-4">
                    <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">{filter === "unread" ? "No unread alerts" : "No notifications to display"}</p>
                  </div>
                ) : (
                  items.map((notif) => (
                    <NotificationsDropdownItem key={notif.id} notif={notif} onMarkRead={markAsRead} onToggleRead={toggleRead} onDismiss={dismissNotification} />
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 font-medium">Showing {items.length} of {notifications.length} (max 5)</span>
                <Link href="/settings?tab=notifications" onClick={() => setShow(false)} className="font-semibold text-[#c99335] hover:underline">
                  Preferences &rarr;
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
