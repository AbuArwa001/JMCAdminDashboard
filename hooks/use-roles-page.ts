import { useState, useEffect } from "react";
import { RoleDetail, PermissionGroup, getRbacRoles, getRbacPermissions, deleteRbacRole } from "@/lib/rbac_api";
import { toast } from "sonner";

export function useRolesPage() {
  const [roles, setRoles] = useState<RoleDetail[]>([]), [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true), [submitting, setSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false), [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [r, p] = await Promise.all([getRbacRoles().catch(() => []), getRbacPermissions().catch(() => [])]);
      setRoles(r);
      setPermissionGroups(p);
    } catch {
      toast.error("Failed to load roles and catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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

  return {
    roles, permissionGroups, loading, submitting, setSubmitting, isCreateOpen, setIsCreateOpen,
    isEditOpen, setIsEditOpen, isDeleteOpen, setIsDeleteOpen, selectedRole, setSelectedRole,
    fetchData, handleDeleteSubmit
  };
}
