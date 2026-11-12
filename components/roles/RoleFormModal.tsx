import { KeyRound, X, Check } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { RoleDetail, PermissionGroup } from "@/lib/rbac_api";
import { COLOR_PRESETS } from "./role-constants";
import { RolePermissionMatrix } from "./RolePermissionMatrix";

interface Props {
  isCreate: boolean;
  selectedRole: RoleDetail | null;
  roleForm: { role_name: string; description: string; color: string; permissions: string[] };
  permissionGroups: PermissionGroup[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (data: any) => void;
  onTogglePermission: (key: string) => void;
  onToggleGroup: (group: PermissionGroup) => void;
}

export function RoleFormModal({
  isCreate, selectedRole, roleForm, permissionGroups, submitting,
  onClose, onSubmit, onFormChange, onTogglePermission, onToggleGroup
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-[#c99335]"><KeyRound className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1512]" style={{ fontFamily: "var(--font-cinzel), serif" }}>{isCreate ? "Create Security Role" : `Edit "${selectedRole?.role_name}"`}</h3>
              <p className="text-xs text-gray-400">Configure title, accent color, and fine-grained module privileges</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Role Title</label>
              <input type="text" required disabled={!isCreate && selectedRole?.is_system} value={roleForm.role_name} onChange={(e) => onFormChange({ ...roleForm, role_name: e.target.value })} placeholder="e.g. Treasury Auditor" className="form-input text-xs" />
            </div>
            <div>
              <label className="form-label">Role Badge Color</label>
              <div className="flex items-center gap-2 pt-1">
                {COLOR_PRESETS.map((c) => (
                  <button key={c.value} type="button" onClick={() => onFormChange({ ...roleForm, color: c.value })} className={clsx("w-7 h-7 rounded-xl transition-transform flex items-center justify-center", roleForm.color === c.value ? "scale-110 ring-2 ring-offset-2 ring-gray-900" : "hover:scale-105")} style={{ backgroundColor: c.value }} title={c.name}>
                    {roleForm.color === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="form-label">Role Description</label>
            <textarea rows={2} value={roleForm.description} onChange={(e) => onFormChange({ ...roleForm, description: e.target.value })} placeholder="Describe the duties of this tier..." className="form-input text-xs" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3"><label className="form-label mb-0">Module Permissions Matrix</label><span className="text-xs font-bold text-[#c99335]">{roleForm.permissions.length} selected</span></div>
            {selectedRole?.is_system && !isCreate ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs leading-relaxed">Permissions for built-in system roles cannot be modified.</div>
            ) : (
              <RolePermissionMatrix permissionGroups={permissionGroups} selectedPermissions={roleForm.permissions} onTogglePermission={onTogglePermission} onToggleGroup={onToggleGroup} />
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
            <button type="button" onClick={onClose} className="btn-secondary py-2.5 px-4 text-xs">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm">{submitting ? "Saving..." : isCreate ? "Create Security Role" : "Save Role Changes"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

