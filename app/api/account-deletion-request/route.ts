import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, reason } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Try logging into Firestore if initialized
    if (admin.apps.length) {
      try {
        await admin.firestore().collection("account_deletion_requests").add({
          name: name || "Anonymous",
          email,
          phone: phone || null,
          reason: reason || null,
          status: "pending",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          source: "web_portal",
        });
      } catch (dbError) {
        console.error("Firestore logging failed:", dbError);
      }
    } else {
      console.log("Account deletion requested:", { name, email, phone, reason });
    }

    return NextResponse.json({
      success: true,
      message: "Deletion request logged successfully",
    });
  } catch (error) {
    console.error("Error in account deletion API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

