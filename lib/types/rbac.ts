import { StaffUser } from "./rbac-user-base";

export * from "./rbac-role";
export * from "./rbac-user-base";
export * from "./rbac-stats";

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
