import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "./firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

/**
 * Request browser notification permission, get the FCM token,
 * register it as a device token with the backend, and subscribe
 * to the `admins` FCM topic via our Next.js server route.
 */
export async function requestAdminFCMPermission(): Promise<string | null> {
  try {
    // FCM Messaging is only supported in browsers
    const supported = await isSupported();
    if (!supported || typeof window === "undefined") return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission denied.");
      return null;
    }

    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (!token) {
      console.warn("[FCM] No FCM token returned.");
      return null;
    }

    // Register the device token with the FastAPI backend
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      await fetch(`${apiUrl}api/v1/khutba/register-device/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcm_token: token, platform: "web" }),
      });
    } catch (err) {
      console.error("[FCM] Failed to register device token:", err);
    }

    // Subscribe the token to the `admins` FCM topic via our server route
    try {
      await fetch("/api/notifications/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error("[FCM] Failed to subscribe to admins topic:", err);
    }

    console.info("[FCM] Admin FCM token registered and subscribed to admins topic.");
    return token;
  } catch (err) {
    console.error("[FCM] requestAdminFCMPermission error:", err);
    return null;
  }
}
