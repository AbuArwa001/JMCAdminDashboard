import { RoleSummary } from "./rbac-role";

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

