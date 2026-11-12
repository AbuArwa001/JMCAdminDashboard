import { LayoutDashboard, Heart, List, CreditCard, Users, ArrowRightLeft } from "lucide-react";
import { MenuSection } from "./sidebar-types";

export const OVERVIEW_AND_FINANCE_SECTIONS: MenuSection[] = [
  {
    title: "Main Overview",
    items: [{ name: "Dashboard", href: "/", icon: LayoutDashboard, iconColor: "text-[#c99335]", permission: "dashboard.view" }],
  },
  {
    title: "Finance & Donations",
    items: [
      { name: "Donation Drives", href: "/drives", icon: Heart, iconColor: "text-rose-400", badge: "Active", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40", permission: ["drives.view", "drives.manage"] },
      { name: "Categories", href: "/categories", icon: List, iconColor: "text-sky-400", permission: "categories.manage" },
      { name: "Donations Log", href: "/donations", icon: CreditCard, iconColor: "text-emerald-400", permission: ["donations.view", "donations.manage"] },
      { name: "Donors & Accounts", href: "/accounts", icon: Users, iconColor: "text-purple-400", permission: ["accounts.view", "accounts.manage"] },
      { name: "Internal Transfers", href: "/transfers", icon: ArrowRightLeft, iconColor: "text-amber-400", permission: ["transfers.view", "transfers.manage"] },
    ],
  },
];
