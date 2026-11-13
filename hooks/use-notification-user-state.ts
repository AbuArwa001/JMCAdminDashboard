"use client";

import { useState, useEffect, useCallback } from "react";
import { UserNotificationState, DEFAULT_STATE } from "@/lib/notification-types";
import { loadUserState, saveUserState } from "@/lib/notification-storage";

export function useNotificationUserState(uid: string) {
  const [state, setState] = useState<UserNotificationState>(DEFAULT_STATE);

  useEffect(() => {
    setState(loadUserState(uid));
  }, [uid]);

  const update = useCallback((fn: (prev: UserNotificationState) => UserNotificationState) => {
    setState((prev) => {
      const next = fn(prev);
      saveUserState(uid, next);
      return next;
    });
  }, [uid]);

  const markAsRead = useCallback((id: number) => {
    update((p) => (p.readIds.includes(id) ? p : { ...p, readIds: [...p.readIds, id] }));
  }, [update]);

  const markAsUnread = useCallback((id: number) => {
    update((p) => ({ ...p, readIds: p.readIds.filter((i) => i !== id) }));
  }, [update]);

  const markAllRead = useCallback((ids: number[]) => {
    update((p) => ({
      ...p,
      readIds: Array.from(new Set([...p.readIds, ...ids])),
      lastReadTimestamp: new Date().toISOString(),
    }));
  }, [update]);

  const dismiss = useCallback((id: number) => {
    update((p) => (p.dismissedIds.includes(id) ? p : { ...p, dismissedIds: [...p.dismissedIds, id] }));
  }, [update]);

  const clearAll = useCallback((ids: number[]) => {
    update((p) => ({ ...p, dismissedIds: Array.from(new Set([...p.dismissedIds, ...ids])) }));
  }, [update]);

  const restore = useCallback(() => update((p) => ({ ...p, dismissedIds: [] })), [update]);

  return { state, markAsRead, markAsUnread, markAllRead, dismiss, clearAll, restore };
}
