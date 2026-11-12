import { Users, CheckCircle2, Crown, KeyRound } from "lucide-react";
import { RbacStats, StaffUser, RoleDetail } from "@/lib/rbac_api";

interface Props {
  stats: RbacStats | null;
  users: StaffUser[];
  roles: RoleDetail[];
}

export function UsersStatCards({ stats, users, roles }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{stats ? stats.total_staff : users.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-[#c99335] border border-amber-100"><Users className="w-5 h-5" /></div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3 font-medium">Registered executive accounts</p>
      </div>

      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Sessions</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats ? stats.active_staff : users.filter((u) => u.is_active).length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-5 h-5" /></div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3 font-medium">Permitted to access portal</p>
      </div>

      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Super Admins</p>
            <h3 className="text-2xl font-black text-[#c99335] mt-1">{stats ? stats.super_admins : users.filter((u) => u.is_super_admin).length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-[#1a1512] text-[#c99335] border border-[#c99335]/30"><Crown className="w-5 h-5" /></div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3 font-medium">Unrestricted clearance</p>
      </div>

      <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Roles</p>
            <h3 className="text-2xl font-black text-sky-600 mt-1">{stats ? stats.roles : roles.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100"><KeyRound className="w-5 h-5" /></div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3 font-medium">Fine-grained permission tiers</p>
      </div>
    </div>
  );
}
