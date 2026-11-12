export interface PermissionItem {
  key: string;
  label: string;
  description: string;
  group: string;
}

export interface PermissionGroup {
  group: string;
  permissions: PermissionItem[];
}

export interface RoleSummary {
  id: string;
  role_name: string;
  description?: string | null;
  color?: string | null;
  is_system?: boolean;
}

export interface RoleDetail {
  id: string;
  role_name: string;
  description?: string | null;
  permissions: string[];
  color?: string | null;
  is_system: boolean;
  user_count: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RoleInput {
  role_name: string;
  description?: string;
  permissions: string[];
  color?: string;
}
