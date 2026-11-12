import { MyAccessResponse } from "@/lib/rbac_api";
import type { User as FirebaseUser } from "firebase/auth";

export async function getAdminFallbackAccess(authUser: FirebaseUser): Promise<MyAccessResponse | null> {
  const tokenResult = await authUser.getIdTokenResult().catch(() => null);
  const isClaimAdmin = tokenResult?.claims?.admin === true;

  if (authUser.email === "admin@jmc.org" || isClaimAdmin) {
    return {
      user: {
        id: authUser.uid,
        email: authUser.email || "admin@jmc.org",
        username: authUser.email ? authUser.email.split("@")[0] : "admin",
        full_name: authUser.displayName || "Executive Administrator",
        is_active: true,
        is_admin: true,
        is_super_admin: authUser.email === "admin@jmc.org",
        role: { id: "staff", role_name: "Staff Administrator", color: "#c99335", is_system: true },
      },
      permissions: ["*"],
      is_super_admin: authUser.email === "admin@jmc.org",
    };
  }
  return null;
}
