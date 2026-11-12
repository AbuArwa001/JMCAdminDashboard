import { Crown, Shield, Mail, Phone, Clock, Edit, KeyRound, Trash2 } from "lucide-react";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { StaffUser } from "@/lib/rbac_api";

interface Props {
  user: StaffUser;
  isSelf: boolean;
  isSuperAdmin: boolean;
  onToggleActive: (u: StaffUser) => void;
  onOpenChangeRole: (u: StaffUser) => void;
  onGenerateReset: (u: StaffUser) => void;
  onOpenRevoke: (u: StaffUser) => void;
}

export function UsersTableRow({
  user, isSelf, isSuperAdmin, onToggleActive, onOpenChangeRole, onGenerateReset, onOpenRevoke
}: Props) {
  const roleColor = user.role?.color || (user.is_super_admin ? "#c99335" : "#10b981");

  return (
    <tr className="hover:bg-gray-50/60 transition-colors group">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-[#1a1512] shadow-sm transition-transform group-hover:scale-105" style={{ background: `linear-gradient(135deg, ${roleColor}25, ${roleColor}60)` }}>
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <span className={clsx("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white", user.is_active ? "bg-emerald-500" : "bg-gray-300")} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900">{user.full_name}</span>
              {user.is_super_admin && <span title="Super Administrator" className="p-1 rounded-md bg-[#1a1512] text-[#c99335]"><Crown className="w-2.5 h-2.5" /></span>}
              {isSelf && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">You</span>}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
              {user.phone_number && <span className="hidden sm:flex items-center gap-1">• <Phone className="w-3 h-3" /> {user.phone_number}</span>}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        {user.role ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border" style={{ backgroundColor: `${roleColor}15`, borderColor: `${roleColor}40`, color: roleColor }}><Shield className="w-3 h-3" />{user.role.role_name}</span>
        ) : user.is_super_admin ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#1a1512] text-[#c99335] border border-[#c99335]/40"><Crown className="w-3 h-3" /> Super Admin</span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Unassigned</span>
        )}
      </td>
      <td className="py-4 px-6">
        <button onClick={() => onToggleActive(user)} disabled={isSelf} className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all", user.is_active ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-rose-50 text-rose-700 hover:bg-rose-100", isSelf && "opacity-60 cursor-not-allowed")}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", user.is_active ? "bg-emerald-500" : "bg-rose-500")} />{user.is_active ? "Active" : "Suspended"}
        </button>
      </td>
      <td className="py-4 px-6 text-xs text-gray-400">
        {user.ss_login ? <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(user.ss_login), { addSuffix: true })}</span> : <span className="text-gray-300">Never logged in</span>}
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => onOpenChangeRole(user)} disabled={isSelf && !isSuperAdmin} className="p-1.5 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50" title="Assign Role"><Edit className="w-4 h-4" /></button>
          <button onClick={() => onGenerateReset(user)} className="p-1.5 rounded-lg text-gray-500 hover:text-sky-700 hover:bg-sky-50" title="Reset Link"><KeyRound className="w-4 h-4" /></button>
          {!isSelf && <button onClick={() => onOpenRevoke(user)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50" title="Revoke Access"><Trash2 className="w-4 h-4" /></button>}
        </div>
      </td>
    </tr>
  );
}
