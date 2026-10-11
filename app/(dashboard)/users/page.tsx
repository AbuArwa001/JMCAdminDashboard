"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  KeyRound,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Crown,
  RefreshCw,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Lock,
  ChevronDown,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import clsx from "clsx";
import PermissionGuard from "@/components/auth/PermissionGuard";
import {
  StaffUser,
  RoleDetail,
  RbacStats,
  getStaffUsers,
  getRbacRoles,
  getRbacStats,
  createStaffUser,
  updateStaffUser,
  revokeStaffAccess,
  generatePasswordResetLink,
} from "@/lib/rbac_api";
import { useRBAC } from "@/hooks/useRBAC";
import { formatDistanceToNow } from "date-fns";

export default function UsersManagementPage() {
  const { staffUser: currentStaff, isSuperAdmin, refreshAccess } = useRBAC();

  const [users, setUsers] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<RoleDetail[]>([]);
  const [stats, setStats] = useState<RbacStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");

  // Modals state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [resetLinkData, setResetLinkData] = useState<{ email: string; link: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    role_id: "",
  });

  // Role Change Form State
  const [newRoleId, setNewRoleId] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData, statsData] = await Promise.all([
        getStaffUsers("staff").catch(() => []),
        getRbacRoles().catch(() => []),
        getRbacStats().catch(() => null),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setStats(statsData);
      if (rolesData.length > 0 && !inviteForm.role_id) {
        setInviteForm((prev) => ({ ...prev, role_id: rolesData[0].id }));
      }
    } catch (err: any) {
      console.error("Error loading staff data:", err);
      toast.error("Failed to load staff accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone_number && u.phone_number.includes(searchQuery));

      const matchesRole =
        selectedRoleFilter === "ALL" ||
        (selectedRoleFilter === "UNASSIGNED" && !u.role) ||
        (u.role && u.role.id === selectedRoleFilter);

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  // Handle Invite / Add Staff
  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.full_name || !inviteForm.email || !inviteForm.role_id) {
      toast.error("Please fill in full name, email, and assign a role");
      return;
    }

    try {
      setSubmitting(true);
      const result = await createStaffUser({
        full_name: inviteForm.full_name,
        email: inviteForm.email,
        phone_number: inviteForm.phone_number || undefined,
        password: inviteForm.password || undefined,
        role_id: inviteForm.role_id,
      });

      toast.success(
        result.created
          ? "New staff member provisioned successfully"
          : "Existing user promoted to staff member"
      );

      if (result.password_reset_link) {
        setResetLinkData({
          email: inviteForm.email,
          link: result.password_reset_link,
        });
      }

      setIsInviteOpen(false);
      setInviteForm({
        full_name: "",
        email: "",
        phone_number: "",
        password: "",
        role_id: roles[0]?.id || "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to create staff account");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Role Change
  const handleChangeRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newRoleId) return;

    try {
      setSubmitting(true);
      await updateStaffUser(selectedUser.id, {
        role_id: newRoleId,
      });
      toast.success(`Role updated for ${selectedUser.full_name}`);
      setIsChangeRoleOpen(false);
      setSelectedUser(null);
      fetchData();
      if (selectedUser.id === currentStaff?.id) {
        refreshAccess();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update role");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle User Active Status
  const handleToggleActive = async (user: StaffUser) => {
    if (user.id === currentStaff?.id) {
      toast.error("You cannot deactivate your own account");
      return;
    }
    const newStatus = !user.is_active;
    try {
      await updateStaffUser(user.id, { is_active: newStatus });
      toast.success(
        `${user.full_name} is now ${newStatus ? "Active" : "Suspended"}`
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u))
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to update user status");
    }
  };

  // Generate Reset Link
  const handleGenerateReset = async (user: StaffUser) => {
    try {
      const res = await generatePasswordResetLink(user.id);
      setResetLinkData({ email: user.email, link: res.password_reset_link });
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Could not generate reset link");
    }
  };

  // Handle Revoke Access
  const handleRevokeSubmit = async () => {
    if (!selectedUser) return;
    try {
      setSubmitting(true);
      await revokeStaffAccess(selectedUser.id);
      toast.success(`Staff access revoked for ${selectedUser.full_name}`);
      setIsRevokeOpen(false);
      setSelectedUser(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to revoke staff access");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PermissionGuard
      permission="users.manage"
      fallbackTitle="Staff Access Restricted"
      fallbackDescription="You require Executive Super Admin authorization to view or manage staff access."
    >
      <div className="space-y-8 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/20">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1
                className="text-2xl md:text-3xl font-bold text-[#1a1512] tracking-tight"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                Executive Staff &amp; Access Control
              </h1>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Grant portal roles, enforce security clearance, and manage administrator accounts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="btn-secondary py-2.5 px-4 text-xs"
              title="Refresh staff records"
            >
              <RefreshCw className={clsx("w-3.5 h-3.5", loading && "animate-spin")} />
              Refresh
            </button>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm"
            >
              <UserPlus className="w-4 h-4" />
              Grant Portal Access
            </button>
          </div>
        </div>

        {/* Executive Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total Staff
                </p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">
                  {stats ? stats.total_staff : users.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 text-[#c99335] border border-amber-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1 font-medium">
              Registered executive accounts
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Active Sessions
                </p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">
                  {stats ? stats.active_staff : users.filter((u) => u.is_active).length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1 font-medium">
              Permitted to access portal
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Super Admins
                </p>
                <h3 className="text-2xl font-black text-[#c99335] mt-1">
                  {stats ? stats.super_admins : users.filter((u) => u.is_super_admin).length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-[#1a1512] text-[#c99335] border border-[#c99335]/30">
                <Crown className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1 font-medium">
              Unrestricted clearance
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Active Roles
                </p>
                <h3 className="text-2xl font-black text-sky-600 mt-1">
                  {stats ? stats.roles : roles.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <KeyRound className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1 font-medium">
              Fine-grained permission tiers
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white transition-all outline-none focus:border-[#c99335]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => setSelectedRoleFilter("ALL")}
              className={clsx(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                selectedRoleFilter === "ALL"
                  ? "bg-[#1a1512] text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              All ({users.length})
            </button>
            {roles.map((r) => {
              const count = users.filter((u) => u.role?.id === r.id).length;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleFilter(r.id)}
                  className={clsx(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5",
                    selectedRoleFilter === r.id
                      ? "bg-[#c99335]/15 border-[#c99335] text-[#1a1512]"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: r.color || "#c99335" }}
                  />
                  <span>{r.role_name}</span>
                  <span className="text-[10px] text-gray-400">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Administrator</th>
                  <th className="py-4 px-6">Assigned Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Last Active</th>
                  <th className="py-4 px-6 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                          <div className="space-y-1">
                            <div className="h-3.5 bg-gray-200 rounded w-28" />
                            <div className="h-2.5 bg-gray-100 rounded w-40" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-100 rounded-full w-24" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-5 bg-gray-100 rounded w-16" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-3 bg-gray-100 rounded w-20" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="h-8 bg-gray-100 rounded w-24 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-bold uppercase tracking-wider">
                        No staff members match this filter
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = user.id === currentStaff?.id;
                    const roleColor = user.role?.color || (user.is_super_admin ? "#c99335" : "#10b981");

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/60 transition-colors group"
                      >
                        {/* Administrator Identity */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="relative">
                              <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-[#1a1512] shadow-sm transition-transform group-hover:scale-105"
                                style={{
                                  background: `linear-gradient(135deg, ${roleColor}25, ${roleColor}60)`,
                                }}
                              >
                                {user.full_name.charAt(0).toUpperCase()}
                              </div>
                              <span
                                className={clsx(
                                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                                  user.is_active ? "bg-emerald-500" : "bg-gray-300"
                                )}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{user.full_name}</span>
                                {user.is_super_admin && (
                                  <span
                                    title="Super Administrator with Root Privileges"
                                    className="p-1 rounded-md bg-[#1a1512] text-[#c99335]"
                                  >
                                    <Crown className="w-2.5 h-2.5" />
                                  </span>
                                )}
                                {isSelf && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {user.email}
                                </span>
                                {user.phone_number && (
                                  <span className="hidden sm:flex items-center gap-1">
                                    • <Phone className="w-3 h-3" /> {user.phone_number}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Assigned Role */}
                        <td className="py-4 px-6">
                          {user.role ? (
                            <span
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                              style={{
                                backgroundColor: `${roleColor}15`,
                                borderColor: `${roleColor}40`,
                                color: roleColor,
                              }}
                            >
                              <Shield className="w-3 h-3" />
                              {user.role.role_name}
                            </span>
                          ) : user.is_super_admin ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1a1512] text-[#c99335] border border-[#c99335]/40">
                              <Crown className="w-3 h-3" /> Super Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleActive(user)}
                            disabled={isSelf}
                            className={clsx(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all",
                              user.is_active
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100",
                              isSelf && "opacity-60 cursor-not-allowed"
                            )}
                            title={isSelf ? "Cannot change self active status" : "Click to toggle"}
                          >
                            <span
                              className={clsx(
                                "w-1.5 h-1.5 rounded-full",
                                user.is_active ? "bg-emerald-500" : "bg-rose-500"
                              )}
                            />
                            {user.is_active ? "Active" : "Suspended"}
                          </button>
                        </td>

                        {/* Last Active */}
                        <td className="py-4 px-6 text-xs text-gray-400">
                          {user.ss_login ? (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(user.ss_login), { addSuffix: true })}
                            </span>
                          ) : (
                            <span className="text-gray-300">Never logged in</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Change Role Button */}
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setNewRoleId(user.role?.id || "");
                                setIsChangeRoleOpen(true);
                              }}
                              disabled={isSelf && !isSuperAdmin}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                              title="Assign / Reassign Role"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Reset Password Link */}
                            <button
                              onClick={() => handleGenerateReset(user)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                              title="Generate Password Reset Link"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            {/* Revoke Portal Access */}
                            {!isSelf && (
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsRevokeOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Revoke Administrator Access"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==================== Modal: Invite / Add Staff ==================== */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden p-6 md:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-[#c99335]">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-[#1a1512]"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                    >
                      Grant Portal Clearance
                    </h3>
                    <p className="text-xs text-gray-400">
                      Provision a new staff account or promote an existing user
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4 pt-5">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inviteForm.full_name}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, full_name: e.target.value }))
                    }
                    placeholder="e.g. Sheikh Omar Farouk"
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="officer@jamiamosque.co.ke"
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={inviteForm.phone_number}
                      onChange={(e) =>
                        setInviteForm((prev) => ({ ...prev, phone_number: e.target.value }))
                      }
                      placeholder="+254 700 000 000"
                      className="form-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="form-label">Temporary Password (Optional)</label>
                    <input
                      type="password"
                      value={inviteForm.password}
                      onChange={(e) =>
                        setInviteForm((prev) => ({ ...prev, password: e.target.value }))
                      }
                      placeholder="Leave blank to auto-generate"
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Assign Role Clearance</label>
                  <select
                    required
                    value={inviteForm.role_id}
                    onChange={(e) =>
                      setInviteForm((prev) => ({ ...prev, role_id: e.target.value }))
                    }
                    className="form-input text-xs bg-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.role_name} — {r.description || `${r.permissions.length} permissions`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  <span className="font-bold">Security Note:</span> If this email is already registered,
                  they will be elevated to the selected role immediately. If new, a secure Firebase account
                  will be provisioned with full audit logging.
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="btn-secondary py-2.5 px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm"
                  >
                    {submitting ? "Provisioning..." : "Confirm & Grant Access"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Modal: Change Role ==================== */}
      <AnimatePresence>
        {isChangeRoleOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Modify Role Assignment</h3>
                    <p className="text-xs text-gray-400">{selectedUser.full_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChangeRoleOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleChangeRoleSubmit} className="space-y-4 pt-5">
                <div>
                  <label className="form-label">Select New Security Role</label>
                  <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
                    {roles.map((r) => {
                      const isSelected = newRoleId === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setNewRoleId(r.id)}
                          className={clsx(
                            "p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3",
                            isSelected
                              ? "border-[#c99335] bg-amber-50/40 shadow-sm"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0"
                            style={{ backgroundColor: r.color || "#c99335" }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900">{r.role_name}</span>
                              {r.is_system && (
                                <span className="text-[9px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                  System
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                              {r.description || `${r.permissions.length} module permissions`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsChangeRoleOpen(false)}
                    className="btn-secondary py-2 px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newRoleId}
                    className="btn-primary py-2 px-5 text-xs shadow-gold-sm"
                  >
                    {submitting ? "Updating..." : "Save Role Assignment"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Modal: Password Reset Link ==================== */}
      <AnimatePresence>
        {resetLinkData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Password Reset Clearance Link
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Share this secure one-time link with <strong>{resetLinkData.email}</strong> to enable
                them to set their portal credentials.
              </p>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={resetLinkData.link}
                  className="bg-transparent text-xs text-gray-700 flex-1 outline-none font-mono truncate"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(resetLinkData.link);
                    toast.success("Link copied to clipboard");
                  }}
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setResetLinkData(null)}
                  className="btn-primary py-2 px-6 text-xs shadow-gold-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Modal: Revoke Staff Access ==================== */}
      <AnimatePresence>
        {isRevokeOpen && selectedUser && (
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
                <h3 className="text-lg font-bold text-gray-900">Revoke Staff Access</h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Are you sure you want to revoke portal administration rights for{" "}
                <strong className="text-gray-900">{selectedUser.full_name}</strong> (
                {selectedUser.email})? Their permissions will be immediately revoked from the JMC Executive Dashboard.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsRevokeOpen(false)}
                  className="btn-secondary py-2.5 px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevokeSubmit}
                  disabled={submitting}
                  className="btn-danger py-2.5 px-5 text-xs shadow-md"
                >
                  {submitting ? "Revoking..." : "Revoke Access"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PermissionGuard>
  );
}
