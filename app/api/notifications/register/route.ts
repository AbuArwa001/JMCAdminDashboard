import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Re-use the existing firebase-admin init from lib/firebase-admin
import "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Missing FCM token" }, { status: 400 });
    }

    if (!admin.apps.length) {
      return NextResponse.json(
        { error: "Firebase Admin not initialized" },
        { status: 500 }
      );
    }

    // Subscribe this device token to the `admins` FCM topic
    await admin.messaging().subscribeToTopic([token], "admins");

    return NextResponse.json({ success: true, topic: "admins" });
  } catch (error: any) {
    console.error("[FCM Register] Error subscribing to admins topic:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
