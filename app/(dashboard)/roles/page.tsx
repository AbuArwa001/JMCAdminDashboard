"use client";

import { KeyRound, Plus, RefreshCw } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useRBAC } from "@/hooks/useRBAC";
import { useRolesPage } from "@/hooks/use-roles-page";
import { useRoleForm } from "@/hooks/use-role-form";
import { RoleCard } from "@/components/roles/RoleCard";
import { RoleFormModal } from "@/components/roles/RoleFormModal";
import { RoleDeleteModal } from "@/components/roles/RoleDeleteModal";

export default function RolesManagementPage() {
  const { refreshAccess } = useRBAC();
  const {
    roles, permissionGroups, loading, submitting, setSubmitting, isCreateOpen, setIsCreateOpen,
    isEditOpen, setIsEditOpen, isDeleteOpen, setIsDeleteOpen, selectedRole, setSelectedRole,
    fetchData, handleDeleteSubmit
  } = useRolesPage();

  const { roleForm, setRoleForm, resetForm, togglePermission, toggleGroupAll, createRole, updateRole } = useRoleForm(() => {
    fetchData();
    refreshAccess();
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try { if (await createRole()) setIsCreateOpen(false); } finally { setSubmitting(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setSubmitting(true);
    try { if (await updateRole(selectedRole)) { setIsEditOpen(false); setSelectedRole(null); } } finally { setSubmitting(false); }
  };

  return (
    <PermissionGuard permission="roles.manage" fallbackTitle="Role Management Restricted" fallbackDescription="Only Executive Super Administrators can define or modify access roles.">
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/20"><KeyRound className="w-5 h-5" /></span>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>Roles &amp; Permission Matrix</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-1">Configure fine-grained module access controls and assign security roles to mosque staff</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} disabled={loading} className="btn-secondary py-2.5 px-4 text-xs"><RefreshCw className={clsx("w-3.5 h-3.5", loading && "animate-spin")} />Refresh</button>
            <button onClick={() => { resetForm(null); setIsCreateOpen(true); }} className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm"><Plus className="w-4 h-4" />Create Custom Role</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (<div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse space-y-4"><div className="h-4 bg-gray-200 rounded w-1/3" /><div className="h-3 bg-gray-100 rounded w-2/3" /></div>))
          ) : (
            roles.map((role) => (
              <RoleCard key={role.id} role={role} onEdit={(r) => { setSelectedRole(r); resetForm(r); setIsEditOpen(true); }} onDelete={(r) => { setSelectedRole(r); setIsDeleteOpen(true); }} />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {(isCreateOpen || isEditOpen) && (
          <RoleFormModal
            isCreate={isCreateOpen}
            selectedRole={selectedRole}
            roleForm={roleForm}
            permissionGroups={permissionGroups}
            submitting={submitting}
            onClose={() => { setIsCreateOpen(false); setIsEditOpen(false); }}
            onSubmit={isCreateOpen ? handleCreate : handleEdit}
            onFormChange={setRoleForm}
            onTogglePermission={togglePermission}
            onToggleGroup={toggleGroupAll}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && selectedRole && (
          <RoleDeleteModal role={selectedRole} submitting={submitting} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteSubmit} />
        )}
      </AnimatePresence>
    </PermissionGuard>
  );
}
