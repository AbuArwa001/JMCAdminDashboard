import { NextResponse } from "next/server";

/**
 * Serves the Firebase Messaging Service Worker with environment variables
 * injected at request time. Rewrite `/firebase-messaging-sw.js` → this route
 * in next.config.js so the browser registers it at the expected SW scope.
 */

export async function GET() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };

  const swContent = `
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp(${JSON.stringify(config)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification || {};
  const notifTitle = title || "JMC Notification";
  const notifOptions = {
    body: body || "",
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
    image: image || undefined,
    data: payload.data || {},
    tag: (payload.data && payload.data.type) || "jmc-notif",
  };
  self.registration.showNotification(notifTitle, notifOptions);
});
`.trim();

  return new NextResponse(swContent, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  });
}
