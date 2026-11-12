import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { updateMe } from "@/lib/api_data";

export async function executeEmailChange(newEmail: string, currentPass: string, oldEmail: string, fullName: string, phone: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("No active Firebase session found. Please log in again.");

  const credential = EmailAuthProvider.credential(currentUser.email || oldEmail, currentPass);
  await reauthenticateWithCredential(currentUser, credential);

  const freshToken = await currentUser.getIdToken(true);
  const response = await fetch("/api/auth/change-email", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${freshToken}` },
    body: JSON.stringify({ newEmail }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Failed to update email.");

  const updatedToken = await currentUser.getIdToken(true);
  Cookies.set("firebaseToken", updatedToken, { expires: 1, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  localStorage.setItem("firebaseToken", updatedToken);

  const storedUser = localStorage.getItem("firebaseUser");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      parsed.email = newEmail;
      localStorage.setItem("firebaseUser", JSON.stringify(parsed));
    } catch {}
  }

  try {
    await updateMe({ full_name: fullName, phone_number: phone, email: newEmail });
  } catch (dbErr) {
    console.warn("Backend user sync notice:", dbErr);
  }
}

