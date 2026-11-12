import { StaffUser } from "@/lib/rbac_api";

export interface RBACContextType {
  staffUser: StaffUser | null;
  permissions: string[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (...permissions: string[]) => boolean;
  hasAllPermissions: (...permissions: string[]) => boolean;
  refreshAccess: () => Promise<void>;
}

