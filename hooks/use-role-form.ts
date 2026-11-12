import { useState } from "react";
import { PermissionGroup, RoleDetail, createRbacRole, updateRbacRole } from "@/lib/rbac_api";
import { toast } from "sonner";

export function useRoleForm(onSuccess: () => void) {
  const [roleForm, setRoleForm] = useState({ role_name: "", description: "", color: "#c99335", permissions: [] as string[] });

  const resetForm = (role?: RoleDetail | null) => {
    if (role) {
      setRoleForm({ role_name: role.role_name, description: role.description || "", color: role.color || "#c99335", permissions: [...role.permissions] });
    } else {
      setRoleForm({ role_name: "", description: "", color: "#c99335", permissions: [] });
    }
  };

  const togglePermission = (permKey: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permKey) ? prev.permissions.filter((k) => k !== permKey) : [...prev.permissions, permKey],
    }));
  };

  const toggleGroupAll = (group: PermissionGroup) => {
    const keys = group.permissions.map((p) => p.key);
    const all = keys.every((k) => roleForm.permissions.includes(k));
    setRoleForm((prev) => ({
      ...prev,
      permissions: all ? prev.permissions.filter((k) => !keys.includes(k)) : Array.from(new Set([...prev.permissions, ...keys])),
    }));
  };

  const createRole = async () => {
    if (!roleForm.role_name.trim()) { toast.error("Role title is required"); return false; }
    if (roleForm.permissions.length === 0) { toast.error("Please grant at least one permission"); return false; }
    await createRbacRole({ role_name: roleForm.role_name.trim(), description: roleForm.description.trim() || undefined, color: roleForm.color, permissions: roleForm.permissions });
    toast.success(`Role "${roleForm.role_name}" created`);
    onSuccess();
    return true;
  };

  const updateRole = async (role: RoleDetail) => {
    await updateRbacRole(role.id, {
      role_name: role.is_system ? undefined : roleForm.role_name.trim(),
      description: roleForm.description.trim() || undefined,
      color: roleForm.color,
      permissions: role.is_system ? undefined : roleForm.permissions,
    });
    toast.success(`Role "${role.role_name}" updated`);
    onSuccess();
    return true;
  };

  return { roleForm, setRoleForm, resetForm, togglePermission, toggleGroupAll, createRole, updateRole };
}
