export async function registerDeviceToken(token: string): Promise<void> {
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

  try {
    await fetch("/api/notifications/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.error("[FCM] Failed to subscribe to admins topic:", err);
  }
}
