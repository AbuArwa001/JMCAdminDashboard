import { User, Shield, Lock, Bell, Crown, UserCheck, KeyRound, ArrowRight } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

interface Props {
  formData: { name: string; email: string };
  roleName: string;
  roleColor: string;
  isSuperAdmin: boolean;
  hasPermission: (p: string) => boolean;
  activeTab: string;
  onSelectTab: (t: string) => void;
}

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "clearance", label: "Security Clearance", icon: Shield },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsSidebar({
  formData, roleName, roleColor, isSuperAdmin, hasPermission, activeTab, onSelectTab
}: Props) {
  return (
    <div className="md:col-span-4 space-y-3">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#1a1512] font-bold text-lg shadow-md" style={{ background: `linear-gradient(135deg, ${roleColor}, #c99335)` }}>
            {formData.name.charAt(0)}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 truncate">{formData.name}</p>
            <p className="text-xs text-gray-400 truncate font-mono">{formData.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 border" style={{ backgroundColor: `${roleColor}15`, borderColor: `${roleColor}40`, color: roleColor }}>
              {isSuperAdmin ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              <span>{roleName}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => onSelectTab(tab.id)} className={clsx("w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-2xl transition-all", isActive ? "bg-[#1a1512] text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
              <tab.icon className={clsx("w-4 h-4", isActive ? "text-[#c99335]" : "text-gray-400")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {(isSuperAdmin || hasPermission("users.manage") || hasPermission("roles.manage")) && (
        <div className="p-4 bg-gradient-to-br from-[#1a1512] to-[#251d18] rounded-3xl text-white shadow-md border border-[#c99335]/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#c99335]"><Crown className="w-4 h-4" /><span>Executive Management</span></div>
          <p className="text-[11px] text-gray-300 leading-relaxed">You have elevated privileges to configure access tiers and manage users.</p>
          <div className="space-y-1.5 pt-1">
            {(isSuperAdmin || hasPermission("users.manage")) && (
              <Link href="/users" className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors">
                <span className="flex items-center gap-2"><UserCheck className="w-3.5 h-3.5 text-[#c99335]" />Manage Staff</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </Link>
            )}
            {(isSuperAdmin || hasPermission("roles.manage")) && (
              <Link href="/roles" className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors">
                <span className="flex items-center gap-2"><KeyRound className="w-3.5 h-3.5 text-[#c99335]" />Roles Matrix</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

