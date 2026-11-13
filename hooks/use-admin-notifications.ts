"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { NotificationLog } from "@/components/layout/header-constants";
import { useAuth } from "@/hooks/useAuth";
import {
  UserNotificationPreferences,
  UserNotificationState,
  DEFAULT_USER_NOTIFICATION_PREFERENCES,
  DEFAULT_USER_NOTIFICATION_STATE,
  getUserNotificationPreferences,
  saveUserNotificationPreferences,
  getUserNotificationState,
  saveUserNotificationState,
  filterNotificationsForUser,
} from "@/lib/user-notification-settings";

export interface EnrichedNotificationLog extends NotificationLog {
  isRead: boolean;
}

export function useAdminNotifications() {
  const { user } = useAuth();
  const userId = user?.uid || user?.email || "anonymous";

  const [rawNotifications, setRawNotifications] = useState<NotificationLog[]>([]);
  const [userState, setUserState] = useState<UserNotificationState>(DEFAULT_USER_NOTIFICATION_STATE);
  const [preferences, setPreferences] = useState<UserNotificationPreferences>(
    DEFAULT_USER_NOTIFICATION_PREFERENCES
  );
  const [loading, setLoading] = useState(false);

  // Sync state and preferences whenever userId changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserState(getUserNotificationState(userId));
      setPreferences(getUserNotificationPreferences(userId));
    }
  }, [userId]);

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/khutba/logs?limit=50");
      const list: NotificationLog[] = Array.isArray(res.data)
        ? res.data
        : res.data?.results || [];
      setRawNotifications(list);
    } catch {
      // silently fail on network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 45000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  // Compute filtered notifications for this specific user
  const notifications: EnrichedNotificationLog[] = useMemo(() => {
    const filtered = filterNotificationsForUser(
      rawNotifications,
      preferences,
      userState.dismissedIds
    );

    const readSet = new Set(userState.readIds);
    const lastReadDate = userState.lastReadTimestamp
      ? new Date(userState.lastReadTimestamp)
      : null;

    return filtered.map((n) => {
      const isExplicitlyRead = readSet.has(n.id);
      const isPastLastRead = lastReadDate ? new Date(n.sent_at) <= lastReadDate : false;
      return {
        ...n,
        isRead: isExplicitlyRead || isPastLastRead,
      };
    });
  }, [rawNotifications, preferences, userState]);

  // Sliced to AT MOST 5 for the notification icon dropdown
  const displayNotifications = useMemo(() => {
    return notifications.slice(0, 5);
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // User Actions:
  const markAsRead = useCallback(
    (id: number) => {
      setUserState((prev) => {
        if (prev.readIds.includes(id)) return prev;
        const next: UserNotificationState = {
          ...prev,
          readIds: [...prev.readIds, id],
        };
        saveUserNotificationState(userId, next);
        return next;
      });
    },
    [userId]
  );

  const markAsUnread = useCallback(
    (id: number) => {
      setUserState((prev) => {
        const next: UserNotificationState = {
          ...prev,
          readIds: prev.readIds.filter((readId) => readId !== id),
        };
        saveUserNotificationState(userId, next);
        return next;
      });
    },
    [userId]
  );

  const toggleRead = useCallback(
    (id: number, currentStatus: boolean) => {
      if (currentStatus) {
        markAsUnread(id);
      } else {
        markAsRead(id);
      }
    },
    [markAsRead, markAsUnread]
  );

  const markAllAsRead = useCallback(() => {
    setUserState((prev) => {
      const visibleIds = notifications.map((n) => n.id);
      const combined = Array.from(new Set([...prev.readIds, ...visibleIds]));
      const next: UserNotificationState = {
        ...prev,
        readIds: combined,
        lastReadTimestamp: new Date().toISOString(),
      };
      saveUserNotificationState(userId, next);
      return next;
    });
  }, [userId, notifications]);

  const dismissNotification = useCallback(
    (id: number) => {
      setUserState((prev) => {
        if (prev.dismissedIds.includes(id)) return prev;
        const next: UserNotificationState = {
          ...prev,
          dismissedIds: [...prev.dismissedIds, id],
        };
        saveUserNotificationState(userId, next);
        return next;
      });
    },
    [userId]
  );

  const clearAllNotifications = useCallback(() => {
    setUserState((prev) => {
      const allVisibleIds = notifications.map((n) => n.id);
      const nextDismissed = Array.from(new Set([...prev.dismissedIds, ...allVisibleIds]));
      const next: UserNotificationState = {
        ...prev,
        dismissedIds: nextDismissed,
      };
      saveUserNotificationState(userId, next);
      return next;
    });
  }, [userId, notifications]);

  const restoreDismissed = useCallback(() => {
    setUserState((prev) => {
      const next: UserNotificationState = {
        ...prev,
        dismissedIds: [],
      };
      saveUserNotificationState(userId, next);
      return next;
    });
  }, [userId]);

  const updatePreferences = useCallback(
    (partial: Partial<UserNotificationPreferences>) => {
      setPreferences((prev) => {
        const next = { ...prev, ...partial };
        saveUserNotificationPreferences(userId, next);
        return next;
      });
    },
    [userId]
  );

  return {
    notifications,
    displayNotifications, // Maximum of 5 notifications
    unreadCount,
    dismissedCount: userState.dismissedIds.length,
    loading,
    preferences,
    markAsRead,
    markAsUnread,
    toggleRead,
    markAllAsRead,
    dismissNotification,
    clearAllNotifications,
    restoreDismissed,
    updatePreferences,
    refresh: fetchNotifs,
  };
}
