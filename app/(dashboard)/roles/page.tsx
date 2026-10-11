"use client";

import { useEffect, useState, useMemo } from "react";
import {
  KeyRound,
  Shield,
  Plus,
  Edit,
  Trash2,
  Users,
  CheckCircle2,
  Sparkles,
  Crown,
  RefreshCw,
  X,
  AlertTriangle,
  Layers,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import clsx from "clsx";
import PermissionGuard from "@/components/auth/PermissionGuard";
import {
  RoleDetail,
  PermissionGroup,
  getRbacRoles,
  getRbacPermissions,
  createRbacRole,
  updateRbacRole,
  deleteRbacRole,
} from "@/lib/rbac_api";
import { useRBAC } from "@/hooks/useRBAC";

const COLOR_PRESETS = [
  { name: "Executive Gold", value: "#c99335" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Sky Azure", value: "#0ea5e9" },
  { name: "Royal Purple", value: "#8b5cf6" },
  { name: "Warm Amber", value: "#f59e0b" },
  { name: "Rose Ruby", value: "#f43f5e" },
  { name: "Teal Mint", value: "#14b8a6" },
  { name: "Slate Charcoal", value: "#475569" },
];

export default function RolesManagementPage() {
  const { isSuperAdmin, refreshAccess } = useRBAC();

  const [roles, setRoles] = useState<RoleDetail[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [roleForm, setRoleForm] = useState({
    role_name: "",
    description: "",
    color: "#c99335",
    permissions: [] as string[],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, permsData] = await Promise.all([
        getRbacRoles().catch(() => []),
        getRbacPermissions().catch(() => []),
      ]);
      setRoles(rolesData);
      setPermissionGroups(permsData);
    } catch (err: any) {
      console.error("Error loading roles:", err);
      toast.error("Failed to load roles and permission catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setRoleForm({
      role_name: "",
      description: "",
      color: "#c99335",
      permissions: [],
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (role: RoleDetail) => {
    setSelectedRole(role);
    setRoleForm({
      role_name: role.role_name,
      description: role.description || "",
      color: role.color || "#c99335",
      permissions: [...role.permissions],
    });
    setIsEditOpen(true);
  };

  const togglePermission = (permKey: string) => {
    setRoleForm((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((k) => k !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const toggleGroupAll = (group: PermissionGroup) => {
    const groupKeys = group.permissions.map((p) => p.key);
    const allSelected = groupKeys.every((k) => roleForm.permissions.includes(k));

    setRoleForm((prev) => {
      if (allSelected) {
        return {
          ...prev,
          permissions: prev.permissions.filter((k) => !groupKeys.includes(k)),
        };
      } else {
        const set = new Set([...prev.permissions, ...groupKeys]);
        return {
          ...prev,
          permissions: Array.from(set),
        };
      }
    });
  };

  // Submit Create Role
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.role_name.trim()) {
      toast.error("Role title is required");
      return;
    }
    if (roleForm.permissions.length === 0) {
      toast.error("Please grant at least one permission to this role");
      return;
    }

    try {
      setSubmitting(true);
      await createRbacRole({
        role_name: roleForm.role_name.trim(),
        description: roleForm.description.trim() || undefined,
        color: roleForm.color,
        permissions: roleForm.permissions,
      });
      toast.success(`Role "${roleForm.role_name}" created successfully`);
      setIsCreateOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create role");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Edit Role
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setSubmitting(true);
      await updateRbacRole(selectedRole.id, {
        role_name: selectedRole.is_system ? undefined : roleForm.role_name.trim(),
        description: roleForm.description.trim() || undefined,
        color: roleForm.color,
        permissions: selectedRole.is_system ? undefined : roleForm.permissions,
      });
      toast.success(`Role "${selectedRole.role_name}" updated`);
      setIsEditOpen(false);
      setSelectedRole(null);
      fetchData();
      refreshAccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update role");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Delete Role
  const handleDeleteSubmit = async () => {
    if (!selectedRole) return;
    try {
      setSubmitting(true);
      await deleteRbacRole(selectedRole.id);
      toast.success(`Role "${selectedRole.role_name}" deleted`);
      setIsDeleteOpen(false);
      setSelectedRole(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Could not delete role");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PermissionGuard
      permission="roles.manage"
      fallbackTitle="Role Management Restricted"
      fallbackDescription="Only Executive Super Administrators can define or modify access roles."
    >
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/20">
                <KeyRound className="w-5 h-5" />
              </span>
              <h1
                className="text-2xl md:text-3xl font-bold text-[#1a1512] tracking-tight"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                Roles &amp; Permission Matrix
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Configure fine-grained module access controls and assign security roles to mosque staff
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-secondary py-2.5 px-4 text-xs"
              title="Refresh roles"
            >
              <RefreshCw className={clsx("w-3.5 h-3.5", loading && "animate-spin")} />
              Refresh
            </button>
            <button
              onClick={openCreateModal}
              className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm"
            >
              <Plus className="w-4 h-4" />
              Create Custom Role
            </button>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse space-y-4"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))
          ) : (
            roles.map((role) => {
              const isSuper = role.permissions.includes("*");
              const roleColor = role.color || (isSuper ? "#c99335" : "#10b981");

              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Color Top Border */}
                    <div
                      className="h-2 w-full"
                      style={{ backgroundColor: roleColor }}
                    />

                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm"
                            style={{
                              backgroundColor: `${roleColor}20`,
                              color: roleColor,
                            }}
                          >
                            {isSuper ? <Crown className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                              {role.role_name}
                            </h3>
                            <span className="text-[11px] font-semibold text-gray-400">
                              {role.user_count} assigned staff member{role.user_count !== 1 && "s"}
                            </span>
                          </div>
                        </div>

                        {role.is_system ? (
                          <span className="text-[9px] uppercase font-bold text-[#c99335] bg-[#c99335]/10 border border-[#c99335]/30 px-2 py-0.5 rounded-full">
                            System
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            Custom
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed min-h-[32px]">
                        {role.description || "Custom operational role with scoped module permissions."}
                      </p>

                      {/* Permissions Summary Badges */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                            Permissions Clearance
                          </span>
                          <span
                            className="font-bold text-xs"
                            style={{ color: roleColor }}
                          >
                            {isSuper ? "Full Root (*)" : `${role.permissions.length} granted`}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                          {isSuper ? (
                            <span className="px-2 py-0.5 bg-[#1a1512] text-[#c99335] text-[10px] font-bold rounded-md">
                              * All Executive Capabilities
                            </span>
                          ) : role.permissions.length === 0 ? (
                            <span className="text-xs text-gray-400 italic">No permissions assigned</span>
                          ) : (
                            role.permissions.slice(0, 6).map((p) => (
                              <span
                                key={p}
                                className="px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-semibold rounded-md"
                              >
                                {p}
                              </span>
                            ))
                          )}
                          {!isSuper && role.permissions.length > 6 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">
                              +{role.permissions.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 px-6 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {role.is_system ? "Protected Built-in" : "Custom Configurable"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(role)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-amber-700 hover:bg-white transition-all shadow-sm border border-gray-200"
                        title="Edit Role Configuration"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {!role.is_system && (
                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setIsDeleteOpen(true);
                          }}
                          disabled={role.user_count > 0}
                          className={clsx(
                            "p-1.5 rounded-lg transition-all shadow-sm border border-gray-200",
                            role.user_count > 0
                              ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                              : "text-gray-600 hover:text-rose-600 hover:bg-white"
                          )}
                          title={
                            role.user_count > 0
                              ? `Cannot delete role with ${role.user_count} assigned staff`
                              : "Delete Role"
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== Modal: Create / Edit Role ==================== */}
      <AnimatePresence>
        {(isCreateOpen || isEditOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-[#c99335]">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-[#1a1512]"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      {isCreateOpen ? "Create Security Role" : `Edit "${selectedRole?.role_name}"`}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Configure title, accent color, and fine-grained module privileges
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit}
                className="flex-1 overflow-y-auto py-4 space-y-5 pr-1"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Role Title</label>
                    <input
                      type="text"
                      required
                      disabled={isEditOpen && selectedRole?.is_system}
                      value={roleForm.role_name}
                      onChange={(e) =>
                        setRoleForm((prev) => ({ ...prev, role_name: e.target.value }))
                      }
                      placeholder="e.g. Treasury Auditor"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label">Role Badge Color</label>
                    <div className="flex items-center gap-2 pt-1">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setRoleForm((prev) => ({ ...prev, color: c.value }))}
                          className={clsx(
                            "w-7 h-7 rounded-xl transition-transform flex items-center justify-center",
                            roleForm.color === c.value
                              ? "scale-110 ring-2 ring-offset-2 ring-gray-900"
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        >
                          {roleForm.color === c.value && (
                            <Check className="w-3.5 h-3.5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Role Description</label>
                  <textarea
                    rows={2}
                    value={roleForm.description}
                    onChange={(e) =>
                      setRoleForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe the duties and intended access of this security tier..."
                    className="form-input text-xs"
                  />
                </div>

                {/* Permission Matrix */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="form-label mb-0">Module Permissions Matrix</label>
                    <span className="text-xs font-bold text-[#c99335]">
                      {roleForm.permissions.length} selected
                    </span>
                  </div>

                  {selectedRole?.is_system && isEditOpen ? (
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs leading-relaxed">
                      Permissions for built-in system roles are strictly managed by system policies and cannot be modified.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {permissionGroups.map((group) => {
                        const groupKeys = group.permissions.map((p) => p.key);
                        const allSelected = groupKeys.every((k) =>
                          roleForm.permissions.includes(k)
                        );

                        return (
                          <div
                            key={group.group}
                            className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200"
                          >
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[#c99335]" />
                                {group.group}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleGroupAll(group)}
                                className="text-[11px] font-bold text-[#c99335] hover:underline"
                              >
                                {allSelected ? "Deselect All" : "Select All"}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {group.permissions.map((perm) => {
                                const isChecked = roleForm.permissions.includes(perm.key);
                                return (
                                  <label
                                    key={perm.key}
                                    onClick={() => togglePermission(perm.key)}
                                    className={clsx(
                                      "p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none",
                                      isChecked
                                        ? "bg-white border-[#c99335] shadow-sm ring-1 ring-[#c99335]/30"
                                        : "bg-white/60 border-gray-200 hover:bg-white"
                                    )}
                                  >
                                    <div
                                      className={clsx(
                                        "w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border transition-colors flex-shrink-0",
                                        isChecked
                                          ? "bg-[#006838] border-[#006838] text-white"
                                          : "border-gray-300 bg-white"
                                      )}
                                    >
                                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-gray-800 leading-tight">
                                        {perm.label}
                                      </p>
                                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">
                                        {perm.description}
                                      </p>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setIsEditOpen(false);
                    }}
                    className="btn-secondary py-2.5 px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm"
                  >
                    {submitting
                      ? "Saving..."
                      : isCreateOpen
                      ? "Create Security Role"
                      : "Save Role Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Modal: Delete Role ==================== */}
      <AnimatePresence>
        {isDeleteOpen && selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="p-2 rounded-xl bg-rose-50">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Custom Role</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Are you sure you want to permanently delete the role{" "}
                <strong className="text-gray-900">{selectedRole.role_name}</strong>?
                This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="btn-secondary py-2.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={submitting}
                  className="btn-danger py-2.5 px-5 text-xs shadow-md"
                >
                  {submitting ? "Deleting..." : "Delete Role"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PermissionGuard>
  );
}
