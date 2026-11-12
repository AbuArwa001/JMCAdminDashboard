import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { NotificationLog } from "@/components/layout/header-constants";
import { shouldShowNotification } from "@/lib/notification-filters";

const LAST_READ_KEY = "jmc_notif_last_read";

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/khutba/logs?limit=50");
      const list: NotificationLog[] = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      const visible = list.filter(shouldShowNotification);
      setNotifications(visible);

      const lastReadStr = localStorage.getItem(LAST_READ_KEY);
      const lastRead = lastReadStr ? new Date(lastReadStr) : new Date(0);
      setUnreadCount(visible.filter((n) => new Date(n.sent_at) > lastRead).length);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    localStorage.setItem(LAST_READ_KEY, new Date().toISOString());
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 45000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  return { notifications, unreadCount, loading, markAllAsRead, refresh: fetchNotifs };
}
