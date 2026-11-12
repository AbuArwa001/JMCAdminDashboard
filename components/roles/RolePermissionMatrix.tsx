import { Check, Layers } from "lucide-react";
import clsx from "clsx";
import { PermissionGroup } from "@/lib/rbac_api";

interface Props {
  permissionGroups: PermissionGroup[];
  selectedPermissions: string[];
  onTogglePermission: (key: string) => void;
  onToggleGroup: (group: PermissionGroup) => void;
}

export function RolePermissionMatrix({
  permissionGroups, selectedPermissions, onTogglePermission, onToggleGroup
}: Props) {
  return (
    <div className="space-y-4">
      {permissionGroups.map((group) => {
        const groupKeys = group.permissions.map((p) => p.key);
        const allSelected = groupKeys.every((k) => selectedPermissions.includes(k));

        return (
          <div key={group.group} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c99335]" />{group.group}
              </span>
              <button type="button" onClick={() => onToggleGroup(group)} className="text-[11px] font-bold text-[#c99335] hover:underline">
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {group.permissions.map((perm) => {
                const isChecked = selectedPermissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    onClick={() => onTogglePermission(perm.key)}
                    className={clsx(
                      "p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 select-none",
                      isChecked ? "bg-white border-[#c99335] shadow-sm ring-1 ring-[#c99335]/30" : "bg-white/60 border-gray-200 hover:bg-white"
                    )}
                  >
                    <div className={clsx("w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border transition-colors flex-shrink-0", isChecked ? "bg-[#006838] border-[#006838] text-white" : "border-gray-300 bg-white")}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 leading-tight">{perm.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">{perm.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
