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
  ShieldCheck,
  HandHeart,
  BookMarked,
  Clock,
  Calculator,
  CalendarDays,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/api_data";

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Main Overview",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard, iconColor: "text-[#c99335]" },
    ],
  },
  {
    title: "Finance & Donations",
    items: [
      { name: "Donation Drives", href: "/drives", icon: Heart, iconColor: "text-rose-400", badge: "Active", badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
      { name: "Categories", href: "/categories", icon: List, iconColor: "text-sky-400" },
      { name: "Donations Log", href: "/donations", icon: CreditCard, iconColor: "text-emerald-400" },
      { name: "Donors & Accounts", href: "/accounts", icon: Users, iconColor: "text-purple-400" },
      { name: "Internal Transfers", href: "/transfers", icon: ArrowRightLeft, iconColor: "text-amber-400" },
    ],
  },
  {
    title: "Community & Content",
    items: [
      { name: "Darsas & Classes", href: "/community/darsas", icon: BookOpen, iconColor: "text-teal-400" },
      { name: "Inspiration Quote", href: "/community/inspiration", icon: Quote, iconColor: "text-pink-400" },
      { name: "Friday Khutba", href: "/community/khutba", icon: Mic, iconColor: "text-amber-400" },
      { name: "Events", href: "/community/events", icon: CalendarDays, iconColor: "text-sky-400" },
      { name: "Duas", href: "/community/duas", icon: HandHeart, iconColor: "text-rose-400" },
      { name: "Quran", href: "/community/quran", icon: BookMarked, iconColor: "text-emerald-400" },
      { name: "Prayer Timings", href: "/community/prayer-times", icon: Clock, iconColor: "text-[#c99335]" },
      { name: "Zakat Calculator", href: "/community/zakat", icon: Calculator, iconColor: "text-green-400" },
    ],
  },
  {
    title: "System & Admin",
    items: [
      { name: "Feature Toggles", href: "/settings/features", icon: ToggleRight, iconColor: "text-violet-400" },
      { name: "Portal Settings", href: "/settings", icon: Settings, iconColor: "text-gray-400" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [user, setUser] = useState({
    name: "Administrator",
    email: "admin@jmc.org",
    role: "Super Admin",
  });

  const pathname = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        if (userData) {
          setUser({
            name: userData.full_name || "Administrator",
            email: userData.email || "admin@jmc.org",
            role: userData.role_name || "Super Admin",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data in sidebar", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out",
        "w-64 bg-[#1a1512] text-white border-r border-[#2d2520] shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#2d2520] bg-[#120e0c] flex items-center justify-between flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-[#1a1512] border border-[#c99335]/40 group-hover:border-[#c99335]/70 p-1 flex items-center justify-center shadow-lg transition-all duration-300">
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
          <div>
            <span className="block font-bold text-sm tracking-wide text-white leading-tight">
              JAMIA MOSQUE
            </span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#c99335] uppercase tracking-widest">
              <ShieldCheck className="w-2.5 h-2.5" /> Executive Portal
            </span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {MENU_SECTIONS.map((section, idx) => (
          <div key={idx}>
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
              {section.title}
            </span>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const IconComponent = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
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
                        <span>{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span
                          className={clsx(
                            "px-1.5 py-0.5 text-[10px] font-semibold rounded border",
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
      </nav>

      {/* Footer — User Profile + Logout */}
      <div className="p-4 border-t border-[#2d2520] bg-[#120e0c] flex-shrink-0 space-y-3">
        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5 border border-white/10">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#c99335] to-[#e39e3b] flex items-center justify-center text-[#1a1512] font-bold text-sm shadow-md">
              {user.name.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#120e0c] rounded-full" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-100 truncate">{user.name}</p>
            <p className="text-[10px] text-[#c99335] font-medium truncate">{user.role}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            // Firebase sign-out handled by useAuth hook
            document.cookie = "firebaseToken=; Max-Age=0; path=/";
            window.location.href = "/login";
          }}
          className="flex w-full items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/60 rounded-md transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out Session
        </button>
      </div>
    </aside>
  );
}
