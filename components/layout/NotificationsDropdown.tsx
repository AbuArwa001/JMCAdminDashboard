"use client";

import { useState } from "react";
import {
  Bell,
  AlertCircle,
  CheckCheck,
  Trash2,
  Settings,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";
import { NotifIcon } from "./NotifIcon";

export function NotificationsDropdown() {
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const {
    notifications,
    displayNotifications, // Already capped at at most 5 items
    unreadCount,
    dismissedCount,
    loading,
    markAsRead,
    toggleRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    restoreDismissed,
  } = useAdminNotifications();

  // If filter is "unread", take unread items capped at 5
  const itemsToDisplay =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead).slice(0, 5)
      : displayNotifications;

  return (
    <div className="relative">
      {/* Bell Trigger */}
      <button
        onClick={() => setShow(!show)}
        className="relative p-2 text-gray-500 hover:text-[#1a1512] hover:bg-gray-100 rounded-xl transition-all"
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
        {show && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-20" onClick={() => setShow(false)} />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute right-0 mt-2 w-96 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-30 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#c99335] text-white rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      title="Mark all as read"
                      className="text-xs font-semibold text-[#006838] hover:text-[#004d29] flex items-center gap-1 hover:underline"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      title="Clear all notifications"
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <Link
                    href="/settings?tab=notifications"
                    onClick={() => setShow(false)}
                    title="Notification preferences"
                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* View Filter Tabs */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      filter === "all"
                        ? "bg-[#1a1512] text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter("unread")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      filter === "unread"
                        ? "bg-[#1a1512] text-white shadow-sm"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                {dismissedCount > 0 && (
                  <button
                    onClick={restoreDismissed}
                    className="text-[11px] text-gray-400 hover:text-[#c99335] flex items-center gap-1"
                    title="Restore previously dismissed notifications"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore ({dismissedCount})</span>
                  </button>
                )}
              </div>

              {/* Notifications List (Strictly capped at most 5) */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                {loading && notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-400 font-medium">
                    Loading notifications…
                  </div>
                ) : itemsToDisplay.length === 0 ? (
                  <div className="py-10 text-center px-4">
                    <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">
                      {filter === "unread"
                        ? "No unread notifications"
                        : "No notifications to display"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {filter === "unread"
                        ? "You are all caught up!"
                        : "Customize your alerts in notification preferences."}
                    </p>
                  </div>
                ) : (
                  itemsToDisplay.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`group relative flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                        notif.isRead
                          ? "bg-white hover:bg-gray-50/80"
                          : "bg-[#c99335]/[0.04] hover:bg-[#c99335]/[0.08]"
                      }`}
                    >
                      {/* Unread Accent Indicator */}
                      {!notif.isRead && (
                        <span
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#c99335]"
                          title="Unread notification"
                        />
                      )}

                      <div className="mt-0.5">
                        <NotifIcon type={notif.notification_type} />
                      </div>

                      <div className="flex-1 min-w-0 pr-12">
                        <p
                          className={`text-xs truncate ${
                            notif.isRead
                              ? "font-medium text-gray-700"
                              : "font-bold text-gray-900"
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.body}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {formatDistanceToNow(new Date(notif.sent_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      {/* Action buttons (Mark Read/Unread & Dismiss) */}
                      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRead(notif.id, notif.isRead);
                          }}
                          title={notif.isRead ? "Mark as unread" : "Mark as read"}
                          className="p-1 rounded-md text-gray-400 hover:text-[#006838] hover:bg-emerald-50 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notif.id);
                          }}
                          title="Dismiss notification"
                          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 font-medium">
                  Showing {itemsToDisplay.length} of {notifications.length} (max 5)
                </span>
                <Link
                  href="/settings?tab=notifications"
                  onClick={() => setShow(false)}
                  className="font-semibold text-[#c99335] hover:text-[#e39e3b] transition-colors"
                >
                  Manage Preferences &rarr;
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
