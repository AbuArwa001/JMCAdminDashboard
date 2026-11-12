import { UserCheck, KeyRound, ToggleRight, Settings } from "lucide-react";
import { MenuSection } from "./sidebar-types";

export const ADMIN_SECTIONS: MenuSection[] = [
  {
    title: "System & Administration",
    items: [
      { name: "Staff Management", href: "/users", icon: UserCheck, iconColor: "text-amber-400", badge: "Super Admin", badgeColor: "bg-[#c99335]/20 text-[#e39e3b] border-[#c99335]/40", permission: "users.manage" },
      { name: "Roles & Permissions", href: "/roles", icon: KeyRound, iconColor: "text-emerald-400", permission: "roles.manage" },
      { name: "Feature Toggles", href: "/settings/features", icon: ToggleRight, iconColor: "text-violet-400", permission: "features.manage" },
      { name: "Portal Settings", href: "/settings", icon: Settings, iconColor: "text-gray-400" },
    ],
  },
];
