import api from "./api";

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

export interface StaffUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  phone_number?: string | null;
  profile_image_url?: string | null;
  is_active: boolean;
  is_admin: boolean;
  is_super_admin: boolean;
  role?: RoleSummary | null;
  ss_login?: string | null;
  firebase_uid?: string | null;
}

export interface StaffUserInput {
  email: string;
  full_name: string;
  password?: string;
  phone_number?: string;
  role_id: string;
}

export interface StaffUserUpdateInput {
  full_name?: string;
  phone_number?: string;
  role_id?: string;
  clear_role?: boolean;
  is_active?: boolean;
  is_admin?: boolean;
}

export interface StaffInviteResponse {
  user: StaffUser;
  created: boolean;
  firebase_synced: boolean;
  password_reset_link?: string | null;
}

export interface MyAccessResponse {
  user: StaffUser;
  permissions: string[];
  is_super_admin: boolean;
}

export interface RbacStats {
  total_staff: number;
  active_staff: number;
  super_admins: number;
  roles: number;
  unassigned: number;
}

// ----------------- API Methods -----------------

export const getMyAccess = async (): Promise<MyAccessResponse> => {
  const response = await api.get<MyAccessResponse>("api/v1/rbac/me");
  return response.data;
};

export const getRbacPermissions = async (): Promise<PermissionGroup[]> => {
  const response = await api.get<PermissionGroup[]>("api/v1/rbac/permissions");
  return response.data;
};

export const getRbacStats = async (): Promise<RbacStats> => {
  const response = await api.get<RbacStats>("api/v1/rbac/stats");
  return response.data;
};

export const getRbacRoles = async (): Promise<RoleDetail[]> => {
  const response = await api.get<RoleDetail[]>("api/v1/rbac/roles");
  return response.data;
};

export const createRbacRole = async (data: RoleInput): Promise<RoleDetail> => {
  const response = await api.post<RoleDetail>("api/v1/rbac/roles", data);
  return response.data;
};

export const updateRbacRole = async (roleId: string, data: Partial<RoleInput>): Promise<RoleDetail> => {
  const response = await api.put<RoleDetail>(`api/v1/rbac/roles/${roleId}`, data);
  return response.data;
};

export const deleteRbacRole = async (roleId: string): Promise<void> => {
  await api.delete(`api/v1/rbac/roles/${roleId}`);
};

export const getStaffUsers = async (
  scope: "staff" | "all" = "staff",
  search?: string,
  roleId?: string
): Promise<StaffUser[]> => {
  const params = new URLSearchParams();
  params.set("scope", scope);
  if (search) params.set("search", search);
  if (roleId) params.set("role_id", roleId);
  const response = await api.get<StaffUser[]>(`api/v1/rbac/users?${params.toString()}`);
  return response.data;
};

export const createStaffUser = async (data: StaffUserInput): Promise<StaffInviteResponse> => {
  const response = await api.post<StaffInviteResponse>("api/v1/rbac/users", data);
  return response.data;
};

export const updateStaffUser = async (
  userId: string,
  data: StaffUserUpdateInput
): Promise<StaffUser> => {
  const response = await api.patch<StaffUser>(`api/v1/rbac/users/${userId}`, data);
  return response.data;
};

export const revokeStaffAccess = async (userId: string): Promise<void> => {
  await api.delete(`api/v1/rbac/users/${userId}`);
};

export const generatePasswordResetLink = async (
  userId: string
): Promise<{ email: string; password_reset_link: string }> => {
  const response = await api.post<{ email: string; password_reset_link: string }>(
    `api/v1/rbac/users/${userId}/password-reset`
  );
  return response.data;
};
