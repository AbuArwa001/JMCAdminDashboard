import {
  UserNotificationPreferences,
  UserNotificationState,
  DEFAULT_PREFS,
  DEFAULT_STATE,
} from "./notification-types";

function key(prefix: string, uid: string): string {
  return `${prefix}_${(uid || "guest").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

export function loadUserPrefs(uid: string): UserNotificationPreferences {
  if (typeof window === "undefined" || !uid) return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(key("jmc_notif_prefs", uid));
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveUserPrefs(uid: string, prefs: UserNotificationPreferences): void {
  if (typeof window === "undefined" || !uid) return;
  try {
    localStorage.setItem(key("jmc_notif_prefs", uid), JSON.stringify(prefs));
  } catch {}
}

export function loadUserState(uid: string): UserNotificationState {
  if (typeof window === "undefined" || !uid) return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(key("jmc_notif_state", uid));
    if (!raw) return DEFAULT_STATE;
    const p = JSON.parse(raw);
    return {
      readIds: Array.isArray(p.readIds) ? p.readIds : [],
      dismissedIds: Array.isArray(p.dismissedIds) ? p.dismissedIds : [],
      lastReadTimestamp: p.lastReadTimestamp || null,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveUserState(uid: string, s: UserNotificationState): void {
  if (typeof window === "undefined" || !uid) return;
  try {
    localStorage.setItem(key("jmc_notif_state", uid), JSON.stringify(s));
  } catch {}
}

