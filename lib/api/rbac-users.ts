import api from "../api";
import { StaffInviteResponse, StaffUser, StaffUserInput, StaffUserUpdateInput } from "../types/rbac";

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
