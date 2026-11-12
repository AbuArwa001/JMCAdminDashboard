import { useState } from "react";
import { Shield, X } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { StaffUser, RoleDetail } from "@/lib/rbac_api";

interface Props {
  user: StaffUser;
  roles: RoleDetail[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (roleId: string) => void;
}

export function UserRoleModal({ user, roles, submitting, onClose, onSubmit }: Props) {
  const [newRoleId, setNewRoleId] = useState(user.role?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoleId) onSubmit(newRoleId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600"><Shield className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Modify Role Assignment</h3>
              <p className="text-xs text-gray-400">{user.full_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          <div>
            <label className="form-label">Select New Security Role</label>
            <div className="space-y-2 mt-2 max-h-60 overflow-y-auto pr-1">
              {roles.map((r) => {
                const isSelected = newRoleId === r.id;
                return (
                  <div key={r.id} onClick={() => setNewRoleId(r.id)} className={clsx("p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3", isSelected ? "border-[#c99335] bg-amber-50/40 shadow-sm" : "border-gray-200 hover:bg-gray-50")}>
                    <div className="w-3.5 h-3.5 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: r.color || "#c99335" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{r.role_name}</span>
                        {r.is_system && <span className="text-[9px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">System</span>}
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{r.description || `${r.permissions.length} module permissions`}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary py-2 px-4 text-xs">Cancel</button>
            <button type="submit" disabled={submitting || !newRoleId} className="btn-primary py-2 px-5 text-xs shadow-gold-sm">{submitting ? "Updating..." : "Save Role Assignment"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
