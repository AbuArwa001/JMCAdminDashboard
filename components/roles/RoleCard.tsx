import { Crown, Shield, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { RoleDetail } from "@/lib/rbac_api";

interface Props {
  role: RoleDetail;
  onEdit: (role: RoleDetail) => void;
  onDelete: (role: RoleDetail) => void;
}

export function RoleCard({ role, onEdit, onDelete }: Props) {
  const isSuper = role.permissions.includes("*");
  const roleColor = role.color || (isSuper ? "#c99335" : "#10b981");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
      <div>
        <div className="h-2 w-full" style={{ backgroundColor: roleColor }} />
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm" style={{ backgroundColor: `${roleColor}20`, color: roleColor }}>
                {isSuper ? <Crown className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{role.role_name}</h3>
                <span className="text-[11px] font-semibold text-gray-400">{role.user_count} assigned staff member{role.user_count !== 1 && "s"}</span>
              </div>
            </div>
            <span className={clsx("text-[9px] uppercase font-bold px-2 py-0.5 rounded-full", role.is_system ? "text-[#c99335] bg-[#c99335]/10 border border-[#c99335]/30" : "text-gray-400 bg-gray-100")}>
              {role.is_system ? "System" : "Custom"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-3 line-clamp-2 min-h-[32px]">{role.description || "Custom operational role with scoped module permissions."}</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Permissions Clearance</span>
              <span className="font-bold text-xs" style={{ color: roleColor }}>{isSuper ? "Full Root (*)" : `${role.permissions.length} granted`}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {isSuper ? (
                <span className="px-2 py-0.5 bg-[#1a1512] text-[#c99335] text-[10px] font-bold rounded-md">* All Executive Capabilities</span>
              ) : role.permissions.length === 0 ? (
                <span className="text-xs text-gray-400 italic">No permissions assigned</span>
              ) : (
                role.permissions.slice(0, 6).map((p) => (<span key={p} className="px-2 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-semibold rounded-md">{p}</span>))
              )}
              {!isSuper && role.permissions.length > 6 && (<span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">+{role.permissions.length - 6} more</span>)}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 px-6 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 font-medium">{role.is_system ? "Protected Built-in" : "Custom Configurable"}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(role)} className="p-1.5 rounded-lg text-gray-600 hover:text-amber-700 hover:bg-white shadow-sm border border-gray-200"><Edit className="w-3.5 h-3.5" /></button>
          {!role.is_system && (
            <button onClick={() => onDelete(role)} disabled={role.user_count > 0} className={clsx("p-1.5 rounded-lg shadow-sm border border-gray-200", role.user_count > 0 ? "text-gray-300 bg-gray-100 cursor-not-allowed" : "text-gray-600 hover:text-rose-600 hover:bg-white")}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
