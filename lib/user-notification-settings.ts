import { NotificationLog } from "@/components/layout/header-constants";
import { getDonationAmount } from "@/lib/notification-filters";

export interface UserNotificationPreferences {
  donations: boolean;
  donationMinAmount: number; // 0 = all, 1000, 5000, 10000, 50000, 100000
  khutba: boolean;
  bulletins: boolean;
  drives: boolean;
  community: boolean;
  browserPush: boolean;
}

export interface UserNotificationState {
  readIds: number[];
  dismissedIds: number[];
  lastReadTimestamp: string | null;
}

export const DEFAULT_USER_NOTIFICATION_PREFERENCES: UserNotificationPreferences = {
  donations: true,
  donationMinAmount: 10000,
  khutba: true,
  bulletins: true,
  drives: true,
  community: true,
  browserPush: true,
};

export const DEFAULT_USER_NOTIFICATION_STATE: UserNotificationState = {
  readIds: [],
  dismissedIds: [],
  lastReadTimestamp: null,
};

function getStorageKey(prefix: string, userId: string): string {
  const safeId = (userId || "guest").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${prefix}_${safeId}`;
}

export function getUserNotificationPreferences(userId: string): UserNotificationPreferences {
  if (typeof window === "undefined" || !userId) return DEFAULT_USER_NOTIFICATION_PREFERENCES;
  try {
    const raw = localStorage.getItem(getStorageKey("jmc_notif_prefs", userId));
    if (!raw) return DEFAULT_USER_NOTIFICATION_PREFERENCES;
    return { ...DEFAULT_USER_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_NOTIFICATION_PREFERENCES;
  }
}

export function saveUserNotificationPreferences(userId: string, prefs: UserNotificationPreferences): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(getStorageKey("jmc_notif_prefs", userId), JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function getUserNotificationState(userId: string): UserNotificationState {
  if (typeof window === "undefined" || !userId) return DEFAULT_USER_NOTIFICATION_STATE;
  try {
    const raw = localStorage.getItem(getStorageKey("jmc_notif_state", userId));
    if (!raw) return DEFAULT_USER_NOTIFICATION_STATE;
    const parsed = JSON.parse(raw);
    return {
      readIds: Array.isArray(parsed.readIds) ? parsed.readIds : [],
      dismissedIds: Array.isArray(parsed.dismissedIds) ? parsed.dismissedIds : [],
      lastReadTimestamp: parsed.lastReadTimestamp || null,
    };
  } catch {
    return DEFAULT_USER_NOTIFICATION_STATE;
  }
}

export function saveUserNotificationState(userId: string, state: UserNotificationState): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(getStorageKey("jmc_notif_state", userId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function filterNotificationsForUser(
  list: NotificationLog[],
  prefs: UserNotificationPreferences,
  dismissedIds: number[]
): NotificationLog[] {
  const dismissedSet = new Set(dismissedIds);

  return list.filter((notif) => {
    // Exclude notifications dismissed by this user
    if (dismissedSet.has(notif.id)) return false;

    const titleLower = (notif.title || "").toLowerCase();
    const bodyLower = (notif.body || "").toLowerCase();
    const fullText = `${titleLower} ${bodyLower}`;
    const type = (notif.notification_type || "").toLowerCase();

    // 1. Donation notifications
    const isDonation =
      type.includes("donation") ||
      fullText.includes("donated") ||
      fullText.includes("donation received");
    if (isDonation) {
      if (!prefs.donations) return false;
      const amount = getDonationAmount(notif);
      if (amount !== null && prefs.donationMinAmount > 0 && amount < prefs.donationMinAmount) {
        return false;
      }
      return true;
    }

    // 2. Bulletin notifications
    const isBulletin = type.includes("bulletin") || fullText.includes("bulletin");
    if (isBulletin) {
      return prefs.bulletins;
    }

    // 3. Khutba notifications
    const isKhutba =
      type.includes("khutba") ||
      fullText.includes("khutba") ||
      fullText.includes("jummah") ||
      fullText.includes("juma");
    if (isKhutba) {
      return prefs.khutba;
    }

    // 4. Drives / Fundraiser campaigns
    const isDrive =
      type.includes("drive") ||
      fullText.includes("fundraiser") ||
      fullText.includes("campaign");
    if (isDrive) {
      return prefs.drives;
    }

    // 5. Community notifications (Events, Darsas, Duas)
    const isCommunity =
      type.includes("community") ||
      type.includes("event") ||
      type.includes("darsa") ||
      type.includes("dua") ||
      fullText.includes("event") ||
      fullText.includes("darsa") ||
      fullText.includes("dua");
    if (isCommunity) {
      return prefs.community;
    }

    return true;
  });
}
