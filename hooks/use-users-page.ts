import { useState, useEffect } from "react";
import { StaffUser, RoleDetail, RbacStats, getStaffUsers, getRbacRoles, getRbacStats, updateStaffUser, revokeStaffAccess, generatePasswordResetLink } from "@/lib/rbac_api";
import { toast } from "sonner";

export function useUsersPage(currentStaff: any) {
  const [users, setUsers] = useState<StaffUser[]>([]), [roles, setRoles] = useState<RoleDetail[]>([]);
  const [stats, setStats] = useState<RbacStats | null>(null), [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resetLinkData, setResetLinkData] = useState<{ email: string; link: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [u, r, s] = await Promise.all([getStaffUsers("staff").catch(() => []), getRbacRoles().catch(() => []), getRbacStats().catch(() => null)]);
      setUsers(u); setRoles(r); setStats(s);
    } catch { toast.error("Failed to load staff accounts"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleActive = async (user: StaffUser) => {
    if (user.id === currentStaff?.id) { toast.error("Cannot deactivate self"); return; }
    const newStatus = !user.is_active;
    await updateStaffUser(user.id, { is_active: newStatus });
    toast.success(`${user.full_name} is now ${newStatus ? "Active" : "Suspended"}`);
    setUsers((p) => p.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)));
  };

  const generateReset = async (user: StaffUser) => {
    const res = await generatePasswordResetLink(user.id);
    setResetLinkData({ email: user.email, link: res.password_reset_link });
  };

  const revokeAccess = async (userId: string) => {
    setSubmitting(true);
    try {
      await revokeStaffAccess(userId);
      toast.success("Staff access revoked");
      fetchData();
    } finally { setSubmitting(false); }
  };

  return { users, roles, stats, loading, submitting, setSubmitting, resetLinkData, setResetLinkData, fetchData, toggleActive, generateReset, revokeAccess };
}

