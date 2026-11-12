import { NotificationLog } from "@/components/layout/header-constants";

export const MIN_DONATION_NOTIFICATION_AMOUNT = 10000;

export function getDonationAmount(notif: NotificationLog): number | null {
  const text = `${notif.title || ""} ${notif.body || ""}`;
  const m1 = text.match(/(?:KES|KSh|USD|\$)?\s*([\d,]+(?:\.\d+)?)\s+donated/i);
  if (m1?.[1]) return parseFloat(m1[1].replace(/,/g, ""));
  const m2 = text.match(/donated\s+(?:KES|KSh|USD|\$)?\s*([\d,]+(?:\.\d+)?)/i);
  if (m2?.[1]) return parseFloat(m2[1].replace(/,/g, ""));
  const m3 = text.match(/(?:KES|KSh|USD|\$)\s*([\d,]+(?:\.\d+)?)/i);
  if (m3?.[1]) return parseFloat(m3[1].replace(/,/g, ""));
  return null;
}

export function shouldShowNotification(notif: NotificationLog): boolean {
  const isDonation = notif.notification_type === "admin_donation" || (notif.title || "").toLowerCase().includes("donation received");
  if (isDonation) {
    const amount = getDonationAmount(notif);
    if (amount !== null && amount < MIN_DONATION_NOTIFICATION_AMOUNT) return false;
  }
  return true;
}

