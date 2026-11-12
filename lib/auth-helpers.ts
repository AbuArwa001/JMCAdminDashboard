import { User } from "firebase/auth";
import api from "./api";
import { MyAccessResponse } from "./rbac_api";
import { storeAuthToken } from "./auth-storage";

export async function checkStaffAccess(user: User, token: string): Promise<boolean> {
  try {
    const idTokenResult = await user.getIdTokenResult(true);
    if (idTokenResult.claims.admin === true || user.email === "admin@jmc.org") return true;
  } catch {}

  try {
    const res = await api.get<MyAccessResponse>("api/v1/rbac/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rbac = res.data;
    if (rbac && (rbac.user?.is_admin || rbac.is_super_admin || (rbac.permissions?.length ?? 0) > 0 || rbac.user?.role)) {
      return true;
    }
  } catch {}
  return false;
}

export function finalizeLogin(user: User, token: string) {
  storeAuthToken(token);
  localStorage.setItem("firebaseUser", JSON.stringify(user));
}

export function mapFirebaseAuthError(code?: string): string {
  if (code === "auth/user-not-found") return "No account found with this email";
  if (code === "auth/wrong-password") return "Incorrect password";
  if (code === "auth/invalid-credential") return "Invalid email or password";
  if (code === "auth/invalid-email") return "Invalid email format";
  if (code === "auth/too-many-requests") return "Too many failed attempts. Please try again later";
  return "Invalid login credentials";
}
