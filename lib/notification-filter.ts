import { NotificationLog } from "@/components/layout/header-constants";
import { getDonationAmount } from "@/lib/notification-filters";
import { UserNotificationPreferences } from "./notification-types";

function matchType(notif: NotificationLog, prefs: UserNotificationPreferences): boolean {
  const text = `${notif.title || ""} ${notif.body || ""}`.toLowerCase();
  const type = (notif.notification_type || "").toLowerCase();

  if (type.includes("donation") || text.includes("donated") || text.includes("donation received")) {
    if (!prefs.donations) return false;
    const amt = getDonationAmount(notif);
    return amt === null || prefs.donationMinAmount === 0 || amt >= prefs.donationMinAmount;
  }
  if (type.includes("bulletin") || text.includes("bulletin")) return prefs.bulletins;
  if (type.includes("khutba") || text.includes("khutba") || text.includes("jummah")) return prefs.khutba;
  if (type.includes("drive") || text.includes("fundraiser") || text.includes("campaign")) return prefs.drives;
  if (type.includes("event") || type.includes("darsa") || type.includes("dua") || text.includes("event") || text.includes("dua")) {
    return prefs.community;
  }
  return true;
}

export function filterUserNotifications(
  list: NotificationLog[],
  prefs: UserNotificationPreferences,
  dismissedIds: number[]
): NotificationLog[] {
  const dismissedSet = new Set(dismissedIds);
  return list.filter((n) => !dismissedSet.has(n.id) && matchType(n, prefs));
}
