import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "./firebase";
import { registerDeviceToken } from "./fcm-registration";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

export async function requestAdminFCMPermission(): Promise<string | null> {
  try {
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

    await registerDeviceToken(token);
    console.info("[FCM] Admin FCM token registered and subscribed to admins topic.");
    return token;
  } catch (err) {
    console.error("[FCM] requestAdminFCMPermission error:", err);
    return null;
  }
}
