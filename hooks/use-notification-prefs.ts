"use client";

import { useState, useEffect, useCallback } from "react";
import { UserNotificationPreferences, DEFAULT_PREFS } from "@/lib/notification-types";
import { loadUserPrefs, saveUserPrefs } from "@/lib/notification-storage";

export function useNotificationPrefs(uid: string) {
  const [prefs, setPrefs] = useState<UserNotificationPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(loadUserPrefs(uid));
  }, [uid]);

  const update = useCallback(
    (partial: Partial<UserNotificationPreferences>) => {
      setPrefs((prev) => {
        const next = { ...prev, ...partial };
        saveUserPrefs(uid, next);
        return next;
      });
    },
    [uid]
  );

  return { prefs, updatePrefs: update };
}
