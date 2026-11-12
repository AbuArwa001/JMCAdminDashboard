"use client";

import { useState } from "react";
import { Bell, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";
import { NotifIcon } from "./NotifIcon";

export function NotificationsDropdown() {
  const [show, setShow] = useState(false);
  const { notifications, unreadCount, loading, markAllAsRead } = useAdminNotifications();

  return (
    <div className="relative">
      <button onClick={() => { setShow(!show); markAllAsRead(); }} className="relative p-2 text-gray-500 hover:text-[#1a1512] hover:bg-gray-100 rounded-xl transition-all" aria-label="Notifications">
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
            <div className="fixed inset-0 z-10" onClick={() => setShow(false)} />
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
                  {unreadCount > 0 && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#c99335] text-white rounded-full">{unreadCount} new</span>}
                </div>
                <button onClick={markAllAsRead} className="text-xs font-semibold text-[#006838] hover:underline">Mark all read</button>
              </div>

              <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                {loading && notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-gray-400 font-medium">Loading notifications…</div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <AlertCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50">
                      <NotifIcon type={notif.notification_type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{notif.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{formatDistanceToNow(new Date(notif.sent_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60 text-center">
                  <span className="text-[11px] text-gray-400 font-medium">Showing last {notifications.length} notifications</span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

