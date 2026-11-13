"use client";

import { useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { EnrichedNotificationLog } from "@/lib/notification-types";
import { filterUserNotifications } from "@/lib/notification-filter";
import { useNotificationFetch } from "./use-notification-fetch";
import { useNotificationUserState } from "./use-notification-user-state";
import { useNotificationPrefs } from "./use-notification-prefs";

export function useAdminNotifications() {
  const { user } = useAuth();
  const uid = user?.uid || user?.email || "anonymous";

  const { raw, loading, refresh } = useNotificationFetch();
  const { state, markAsRead, markAsUnread, markAllRead, dismiss, clearAll, restore } =
    useNotificationUserState(uid);
  const { prefs, updatePrefs } = useNotificationPrefs(uid);

  const notifications = useMemo<EnrichedNotificationLog[]>(() => {
    const filtered = filterUserNotifications(raw, prefs, state.dismissedIds);
    const readSet = new Set(state.readIds);
    const lastRead = state.lastReadTimestamp ? new Date(state.lastReadTimestamp) : null;
    return filtered.map((n) => ({
      ...n,
      isRead: readSet.has(n.id) || (lastRead ? new Date(n.sent_at) <= lastRead : false),
    }));
  }, [raw, prefs, state]);

  const displayNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const toggleRead = useCallback(
    (id: number, isRead: boolean) => (isRead ? markAsUnread(id) : markAsRead(id)),
    [markAsRead, markAsUnread]
  );
  const markAllAsRead = useCallback(() => markAllRead(notifications.map((n) => n.id)), [markAllRead, notifications]);
  const clearAllNotifications = useCallback(() => clearAll(notifications.map((n) => n.id)), [clearAll, notifications]);

  return {
    notifications,
    displayNotifications,
    unreadCount,
    dismissedCount: state.dismissedIds.length,
    loading,
    preferences: prefs,
    markAsRead,
    markAsUnread,
    toggleRead,
    markAllAsRead,
    dismissNotification: dismiss,
    clearAllNotifications,
    restoreDismissed: restore,
    updatePreferences: updatePrefs,
    refresh,
  };
}
