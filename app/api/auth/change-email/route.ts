import { NextRequest, NextResponse } from "next/server";
import { admin, verifySession } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication token missing or invalid." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifySession(token);
    if (!decodedToken || !decodedToken.uid || decodedToken.uid === "skipped-verification") {
      return NextResponse.json(
        { error: "Invalid or expired session. Please log in again." },
        { status: 401 }
      );
    }

    // Security check: Verify recent re-authentication (within 5 minutes = 300 seconds)
    const now = Math.floor(Date.now() / 1000);
    const authTime = (decodedToken as any).auth_time || 0;
    if (now - authTime > 300) {
      return NextResponse.json(
        {
          error:
            "Re-authentication expired. Please re-enter your current password to authorize this email update.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { newEmail } = body;

    if (!newEmail || typeof newEmail !== "string") {
      return NextResponse.json(
        { error: "A valid new email address is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = newEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format. Please check for spelling mistakes." },
        { status: 400 }
      );
    }

    if (decodedToken.email && decodedToken.email.toLowerCase() === trimmedEmail) {
      return NextResponse.json(
        { error: "The new email is identical to your current email address." },
        { status: 400 }
      );
    }

    // Update in Firebase Auth via Admin SDK
    await admin.auth().updateUser(decodedToken.uid, {
      email: trimmedEmail,
      emailVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: `Email successfully updated to ${trimmedEmail}`,
      email: trimmedEmail,
    });
  } catch (error: any) {
    console.error("Change email API error:", error);

    if (error.code === "auth/email-already-exists") {
      return NextResponse.json(
        { error: "This email address is already associated with another account." },
        { status: 409 }
      );
    }

    if (error.code === "auth/invalid-email") {
      return NextResponse.json(
        { error: "The specified email address is invalid." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update email address. Please try again." },
      { status: 500 }
    );
  }
}
