"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  List,
  CreditCard,
  Settings,
  X,
  ArrowRightLeft,
  BookOpen,
  Quote,
  Mic,
  ToggleRight,
  Users,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  HandHeart,
  BookMarked,
  Clock,
  Calculator,
  CalendarDays,
  LogOut,
  Newspaper,
  UserCheck,
  KeyRound,
  Crown,
  Shield,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useRBAC } from "@/hooks/useRBAC";
import { useAuth } from "@/hooks/useAuth";

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  permission?: string | string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const ALL_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Main Overview",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        iconColor: "text-[#c99335]",
        permission: "dashboard.view",
      },
    ],
  },
  {
    title: "Finance & Donations",
    items: [
      {
        name: "Donation Drives",
        href: "/drives",
        icon: Heart,
        iconColor: "text-rose-400",
        badge: "Active",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        permission: ["drives.view", "drives.manage"],
      },
      {
        name: "Categories",
        href: "/categories",
        icon: List,
        iconColor: "text-sky-400",
        permission: "categories.manage",
      },
      {
        name: "Donations Log",
        href: "/donations",
        icon: CreditCard,
        iconColor: "text-emerald-400",
        permission: ["donations.view", "donations.manage"],
      },
      {
        name: "Donors & Accounts",
        href: "/accounts",
        icon: Users,
        iconColor: "text-purple-400",
        permission: ["accounts.view", "accounts.manage"],
      },
      {
        name: "Internal Transfers",
        href: "/transfers",
        icon: ArrowRightLeft,
        iconColor: "text-amber-400",
        permission: ["transfers.view", "transfers.manage"],
      },
    ],
  },
  {
    title: "Community & Content",
    items: [
      {
        name: "Darsas & Classes",
        href: "/community/darsas",
        icon: BookOpen,
        iconColor: "text-teal-400",
        permission: "darsas.manage",
      },
      {
        name: "Inspiration Quote",
        href: "/community/inspiration",
        icon: Quote,
        iconColor: "text-pink-400",
        permission: "inspiration.manage",
      },
      {
        name: "Friday Khutba",
        href: "/community/khutba",
        icon: Mic,
        iconColor: "text-amber-400",
        permission: "khutba.manage",
      },
      {
        name: "Friday Bulletins",
        href: "/community/bulletins",
        icon: Newspaper,
        iconColor: "text-blue-400",
        permission: "bulletins.manage",
      },
      {
        name: "Events",
        href: "/community/events",
        icon: CalendarDays,
        iconColor: "text-sky-400",
        permission: "events.manage",
      },
      {
        name: "Duas",
        href: "/community/duas",
        icon: HandHeart,
        iconColor: "text-rose-400",
        permission: "duas.manage",
      },
      {
        name: "Quran",
        href: "/community/quran",
        icon: BookMarked,
        iconColor: "text-emerald-400",
        permission: "quran.manage",
      },
      {
        name: "Prayer Timings",
        href: "/community/prayer-times",
        icon: Clock,
        iconColor: "text-[#c99335]",
        permission: "prayer_times.manage",
      },
      {
        name: "Zakat Calculator",
        href: "/community/zakat",
        icon: Calculator,
        iconColor: "text-green-400",
        permission: "zakat.manage",
      },
    ],
  },
  {
    title: "System & Administration",
    items: [
      {
        name: "Staff Management",
        href: "/users",
        icon: UserCheck,
        iconColor: "text-amber-400",
        badge: "Super Admin",
        badgeColor: "bg-[#c99335]/20 text-[#e39e3b] border-[#c99335]/40",
        permission: "users.manage",
      },
      {
        name: "Roles & Permissions",
        href: "/roles",
        icon: KeyRound,
        iconColor: "text-emerald-400",
        permission: "roles.manage",
      },
      {
        name: "Feature Toggles",
        href: "/settings/features",
        icon: ToggleRight,
        iconColor: "text-violet-400",
        permission: "features.manage",
      },
      {
        name: "Portal Settings",
        href: "/settings",
        icon: Settings,
        iconColor: "text-gray-400",
      },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  isMobileOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isOpen,
  isMobileOpen: propMobileOpen,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const isMobileOpen = propMobileOpen !== undefined ? propMobileOpen : (isOpen ?? false);
  const pathname = usePathname();
  const { staffUser, isSuperAdmin, hasAnyPermission } = useRBAC();
  const { logout } = useAuth();

  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose?.();
    }
  };

  // Filter sections and items based on role-based access control
  const filteredSections = ALL_MENU_SECTIONS.map((section) => {
    const visibleItems = section.items.filter((item) => {
      if (isSuperAdmin) return true;
      if (!item.permission) return true;
      const perms = Array.isArray(item.permission) ? item.permission : [item.permission];
      return hasAnyPermission(...perms);
    });
    return {
      ...section,
      items: visibleItems,
    };
  }).filter((section) => section.items.length > 0);

  const displayName = staffUser?.full_name || "Administrator";
  const roleName = staffUser?.role?.role_name || (isSuperAdmin ? "Super Admin" : "Staff Member");
  const roleColor = staffUser?.role?.color || (isSuperAdmin ? "#c99335" : "#10b981");

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out",
        "bg-[#1a1512] text-white border-r border-[#2d2520] shadow-xl",
        // Desktop width
        isCollapsed ? "lg:w-20" : "lg:w-64",
        // Mobile width & translate
        "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#2d2520] bg-[#120e0c] flex items-center justify-between flex-shrink-0 h-16">
        {isCollapsed ? (
          <div className="w-full flex items-center justify-center relative group">
            <Link
              href="/"
              onClick={handleLinkClick}
              className="relative w-10 h-10 rounded-xl bg-[#1a1512] border border-[#c99335]/40 hover:border-[#c99335] p-1 flex items-center justify-center shadow-lg transition-all"
            >
              <Image
                src="/logo.png"
                alt="JMC Logo"
                width={30}
                height={30}
                className="object-contain"
                priority
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
            </Link>
            {/* Tooltip on hover */}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#120e0c] border border-[#c99335]/40 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[70]">
              Jamia Mosque Executive Portal
            </div>
          </div>
        ) : (
          <>
            <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3 group min-w-0">
              <div className="relative w-10 h-10 rounded-xl bg-[#1a1512] border border-[#c99335]/40 group-hover:border-[#c99335]/70 p-1 flex items-center justify-center shadow-lg transition-all flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="JMC Logo"
                  width={32}
                  height={32}
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
              </div>
              <div className="overflow-hidden">
                <span className="block font-bold text-sm tracking-wide text-white leading-tight truncate">
                  JAMIA MOSQUE
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-[#c99335] uppercase tracking-widest truncate">
                  <ShieldCheck className="w-2.5 h-2.5 flex-shrink-0" /> Executive Portal
                </span>
              </div>
            </Link>

            {/* Desktop Retract Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-[#c99335] hover:bg-white/10 transition-colors"
              aria-label="Retract sidebar"
              title="Retract sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={clsx("flex-1 overflow-y-auto py-4 space-y-4", isCollapsed ? "px-2" : "px-3")}>
        {filteredSections.map((section, idx) => (
          <div key={idx}>
            {isCollapsed ? (
              idx > 0 ? <div className="my-2 border-t border-[#2d2520]/60 mx-1" /> : null
            ) : (
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                {section.title}
              </span>
            )}

            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const IconComponent = item.icon;

                if (isCollapsed) {
                  return (
                    <li key={item.href} className="relative group">
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={clsx(
                          "flex items-center justify-center w-11 h-10 mx-auto rounded-xl transition-all duration-150 relative",
                          isActive
                            ? "bg-[#c99335]/20 text-[#c99335] border border-[#c99335]/40 shadow-sm"
                            : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                        aria-label={item.name}
                      >
                        <IconComponent
                          className={clsx(
                            "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
                            isActive ? "text-[#c99335]" : (item.iconColor || "text-gray-400")
                          )}
                        />
                        {isActive && (
                          <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#c99335] rounded-r-full" />
                        )}
                      </Link>

                      {/* Floating Tooltip */}
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] hidden group-hover:flex items-center pointer-events-none">
                        <div className="bg-[#120e0c] border border-[#c99335]/40 text-white text-xs font-semibold rounded-lg py-1.5 px-3 shadow-2xl whitespace-nowrap flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span
                              className={clsx(
                                "px-1.5 py-0.5 text-[9px] font-semibold rounded border uppercase tracking-wider",
                                item.badgeColor || "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className={clsx(
                        "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "bg-white/10 text-white border-l-4 border-[#c99335] pl-2"
                          : "text-gray-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent pl-2"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent
                          className={clsx(
                            "w-4 h-4 flex-shrink-0",
                            isActive ? "text-[#c99335]" : (item.iconColor || "text-gray-400")
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span
                          className={clsx(
                            "px-1.5 py-0.5 text-[9px] font-semibold rounded border uppercase tracking-wider",
                            item.badgeColor || "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <ChevronRight className="w-3.5 h-3.5 text-[#c99335]/70" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Desktop Retract/Expand Toggle in Navigation Footer */}
        <div className="pt-2 mt-2 border-t border-[#2d2520]/60 hidden lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={clsx(
              "flex items-center gap-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-[#c99335] hover:bg-white/10 transition-all",
              isCollapsed ? "justify-center w-11 h-10 mx-auto px-0" : "w-full px-3"
            )}
            title={isCollapsed ? "Expand sidebar" : "Retract sidebar"}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-[#c99335]" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-[#c99335]" />
                <span>Retract Sidebar</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Footer — User Profile + Logout */}
      <div className={clsx("border-t border-[#2d2520] bg-[#120e0c] flex-shrink-0", isCollapsed ? "p-3 space-y-3" : "p-4 space-y-3")}>
        {isCollapsed ? (
          <>
            {/* User Avatar with Tooltip */}
            <div className="relative group mx-auto flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1a1512] font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${roleColor}, #c99335)`,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
              {/* Tooltip */}
              <div className="absolute left-full ml-3 bottom-0 z-[70] hidden group-hover:flex flex-col pointer-events-none">
                <div className="bg-[#120e0c] border border-[#c99335]/40 text-white rounded-lg p-2.5 shadow-2xl whitespace-nowrap">
                  <p className="text-xs font-bold text-gray-100">{displayName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {isSuperAdmin && <Crown className="w-3 h-3 text-[#c99335] flex-shrink-0" />}
                    <p className="text-[10px] font-semibold tracking-wide" style={{ color: roleColor }}>
                      {roleName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Icon Button with Tooltip */}
            <div className="relative group mx-auto flex items-center justify-center">
              <button
                type="button"
                onClick={() => logout()}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-300 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/70 transition-all shadow-sm active:scale-95"
                aria-label="Sign Out Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] hidden group-hover:flex pointer-events-none">
                <div className="bg-[#120e0c] border border-rose-900/50 text-rose-300 text-xs font-semibold rounded-lg py-1 px-2.5 shadow-2xl whitespace-nowrap">
                  Sign Out Session
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* User Card */}
            <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#1a1512] font-bold text-sm shadow-md transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${roleColor}, #c99335)`,
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-100 truncate">{displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isSuperAdmin && <Crown className="w-3 h-3 text-[#c99335] flex-shrink-0" />}
                  <p
                    className="text-[10px] font-semibold truncate tracking-wide"
                    style={{ color: roleColor }}
                  >
                    {roleName}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/60 rounded-xl transition-all shadow-sm active:scale-98"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out Session
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
