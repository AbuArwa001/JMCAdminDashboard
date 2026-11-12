import { StaffUser } from "./rbac-user-base";

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
