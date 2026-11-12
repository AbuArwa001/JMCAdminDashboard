import { Search, Filter } from "lucide-react";
import clsx from "clsx";
import { StaffUser, RoleDetail } from "@/lib/rbac_api";

interface Props {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRoleFilter: string;
  onRoleFilterChange: (id: string) => void;
  users: StaffUser[];
  roles: RoleDetail[];
}

export function UsersFilterToolbar({
  searchQuery, onSearchChange, selectedRoleFilter, onRoleFilterChange, users, roles
}: Props) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white outline-none focus:border-[#c99335]"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <button
          onClick={() => onRoleFilterChange("ALL")}
          className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
            selectedRoleFilter === "ALL" ? "bg-[#1a1512] text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          )}
        >
          All ({users.length})
        </button>
        {roles.map((r) => {
          const count = users.filter((u) => u.role?.id === r.id).length;
          return (
            <button
              key={r.id}
              onClick={() => onRoleFilterChange(r.id)}
              className={clsx(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5",
                selectedRoleFilter === r.id ? "bg-[#c99335]/15 border-[#c99335] text-[#1a1512]" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color || "#c99335" }} />
              <span>{r.role_name}</span>
              <span className="text-[10px] text-gray-400">({count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

