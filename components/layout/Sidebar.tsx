"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import clsx from "clsx";
import { useRBAC } from "@/hooks/useRBAC";
import { useAuth } from "@/hooks/useAuth";
import { ALL_MENU_SECTIONS } from "./sidebar-menu";
import { SidebarBrandHeader } from "./SidebarBrandHeader";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarFooter } from "./SidebarFooter";

interface SidebarProps {
  isOpen?: boolean;
  isMobileOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isOpen, isMobileOpen: propMobileOpen, isCollapsed = false, onClose, onToggleCollapse }: SidebarProps) {
  const isMobileOpen = propMobileOpen !== undefined ? propMobileOpen : (isOpen ?? false);
  const pathname = usePathname();
  const { staffUser, isSuperAdmin, hasAnyPermission } = useRBAC();
  const { logout } = useAuth();

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) onClose?.();
  };

  const filteredSections = ALL_MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (isSuperAdmin || !item.permission) return true;
      const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
      return hasAnyPermission(...perms);
    }),
  })).filter((s) => s.items.length > 0);

  return (
    <aside className={clsx("fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out bg-[#1a1512] text-white border-r border-[#2d2520] shadow-xl", isCollapsed ? "lg:w-20" : "lg:w-64", "w-64", isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
      <SidebarBrandHeader isCollapsed={isCollapsed} onClose={onClose} onToggleCollapse={onToggleCollapse} onLinkClick={handleLinkClick} />
      <nav className={clsx("flex-1 overflow-y-auto py-4 space-y-4", isCollapsed ? "px-2" : "px-3")}>
        {filteredSections.map((section, idx) => (
          <div key={idx}>
            {isCollapsed ? (idx > 0 && <div className="my-2 border-t border-[#2d2520]/60 mx-1" />) : (
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">{section.title}</span>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <SidebarNavItem key={item.href} item={item} isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))} isCollapsed={isCollapsed} onLinkClick={handleLinkClick} />
              ))}
            </ul>
          </div>
        ))}
        <div className="pt-2 mt-2 border-t border-[#2d2520]/60 hidden lg:block">
          <button type="button" onClick={onToggleCollapse} className={clsx("flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-[#c99335] hover:bg-white/10 transition-all", isCollapsed ? "justify-center w-11 h-10 mx-auto px-0" : "w-full px-3")}>
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5 text-[#c99335]" /> : <><PanelLeftClose className="w-4 h-4 text-[#c99335]" /><span>Retract Sidebar</span></>}
          </button>
        </div>
      </nav>
      <SidebarFooter isCollapsed={isCollapsed} displayName={staffUser?.full_name || "Administrator"} roleName={staffUser?.role?.role_name || (isSuperAdmin ? "Super Admin" : "Staff Member")} roleColor={staffUser?.role?.color || (isSuperAdmin ? "#c99335" : "#10b981")} isSuperAdmin={isSuperAdmin} onLogout={() => logout()} />
    </aside>
  );
}
