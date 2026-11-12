import api from "../api";
import { MyAccessResponse, PermissionGroup, RbacStats, RoleDetail, RoleInput } from "../types/rbac";

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

