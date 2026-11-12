"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, UserPlus, RefreshCw, Users } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useRBAC } from "@/hooks/useRBAC";
import { useUsersPage } from "@/hooks/use-users-page";
import { StaffUser, createStaffUser, updateStaffUser } from "@/lib/rbac_api";
import { UsersStatCards } from "@/components/users/UsersStatCards";
import { UsersFilterToolbar } from "@/components/users/UsersFilterToolbar";
import { UsersTableRow } from "@/components/users/UsersTableRow";
import { UserInviteModal } from "@/components/users/UserInviteModal";
import { UserRoleModal } from "@/components/users/UserRoleModal";
import { UserRevokeModal } from "@/components/users/UserRevokeModal";
import { UserResetLinkModal } from "@/components/users/UserResetLinkModal";
import { toast } from "sonner";

export default function UsersManagementPage() {
  const { staffUser: currentStaff, isSuperAdmin, refreshAccess } = useRBAC();
  const {
    users, roles, stats, loading, submitting, setSubmitting, resetLinkData, setResetLinkData,
    fetchData, toggleActive, generateReset, revokeAccess
  } = useUsersPage(currentStaff);

  const [searchQuery, setSearchQuery] = useState(""), [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [isInviteOpen, setIsInviteOpen] = useState(false), [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false), [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !searchQuery || u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || (u.phone_number && u.phone_number.includes(searchQuery));
      const matchRole = selectedRoleFilter === "ALL" || (selectedRoleFilter === "UNASSIGNED" && !u.role) || (u.role && u.role.id === selectedRoleFilter);
      return matchSearch && matchRole;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  const handleInvite = async (form: any) => {
    setSubmitting(true);
    try {
      const res = await createStaffUser(form);
      toast.success(res.created ? "Staff member provisioned" : "User promoted to staff");
      if (res.password_reset_link) setResetLinkData({ email: form.email, link: res.password_reset_link });
      setIsInviteOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err?.response?.data?.detail || "Failed to create staff account"); } finally { setSubmitting(false); }
  };

  const handleChangeRole = async (newRoleId: string) => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await updateStaffUser(selectedUser.id, { role_id: newRoleId });
      toast.success(`Role updated for ${selectedUser.full_name}`);
      setIsChangeRoleOpen(false);
      fetchData();
      if (selectedUser.id === currentStaff?.id) refreshAccess();
    } catch { toast.error("Failed to update role"); } finally { setSubmitting(false); }
  };

  return (
    <PermissionGuard permission="users.manage" fallbackTitle="Staff Access Restricted" fallbackDescription="You require Executive Super Admin authorization to view or manage staff access.">
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><span className="p-2 rounded-xl bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/20"><ShieldCheck className="w-5 h-5" /></span><h1 className="text-2xl md:text-3xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>Executive Staff &amp; Access Control</h1></div>
            <p className="text-sm text-gray-500 font-medium mt-1">Grant portal roles, enforce security clearance, and manage administrator accounts</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} disabled={loading} className="btn-secondary py-2.5 px-4 text-xs"><RefreshCw className={clsx("w-3.5 h-3.5", loading && "animate-spin")} />Refresh</button>
            <button onClick={() => setIsInviteOpen(true)} className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm"><UserPlus className="w-4 h-4" />Grant Portal Access</button>
          </div>
        </div>

        <UsersStatCards stats={stats} users={users} roles={roles} />
        <UsersFilterToolbar searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedRoleFilter={selectedRoleFilter} onRoleFilterChange={setSelectedRoleFilter} users={users} roles={roles} />

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <tr><th className="py-4 px-6">Administrator</th><th className="py-4 px-6">Assigned Role</th><th className="py-4 px-6">Status</th><th className="py-4 px-6">Last Active</th><th className="py-4 px-6 text-right">Access Controls</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredUsers.map((u) => (<UsersTableRow key={u.id} user={u} isSelf={u.id === currentStaff?.id} isSuperAdmin={isSuperAdmin} onToggleActive={toggleActive} onOpenChangeRole={(usr) => { setSelectedUser(usr); setIsChangeRoleOpen(true); }} onGenerateReset={generateReset} onOpenRevoke={(usr) => { setSelectedUser(usr); setIsRevokeOpen(true); }} />))}
                {filteredUsers.length === 0 && !loading && (<tr><td colSpan={5} className="py-12 text-center text-gray-400"><Users className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-xs font-bold uppercase tracking-wider">No staff members match this filter</p></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>{isInviteOpen && <UserInviteModal roles={roles} submitting={submitting} onClose={() => setIsInviteOpen(false)} onSubmit={handleInvite} />}</AnimatePresence>
      <AnimatePresence>{isChangeRoleOpen && selectedUser && <UserRoleModal user={selectedUser} roles={roles} submitting={submitting} onClose={() => setIsChangeRoleOpen(false)} onSubmit={handleChangeRole} />}</AnimatePresence>
      <AnimatePresence>{resetLinkData && <UserResetLinkModal resetData={resetLinkData} onClose={() => setResetLinkData(null)} />}</AnimatePresence>
      <AnimatePresence>{isRevokeOpen && selectedUser && <UserRevokeModal user={selectedUser} submitting={submitting} onClose={() => setIsRevokeOpen(false)} onConfirm={() => revokeAccess(selectedUser.id).then(() => setIsRevokeOpen(false))} />}</AnimatePresence>
    </PermissionGuard>
  );
}
