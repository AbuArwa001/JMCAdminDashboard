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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  MoonStar,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/api_data";
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "FINANCE & DONATIONS",
    items: [
      { name: "Donation Drives", href: "/drives", icon: Heart, badge: "Active", badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
      { name: "Categories", href: "/categories", icon: List },
      { name: "Donations Log", href: "/donations", icon: CreditCard },
      { name: "Donors & Accounts", href: "/accounts", icon: Users },
      { name: "Internal Transfers", href: "/transfers", icon: ArrowRightLeft },
    ],
  },
  {
    title: "COMMUNITY & CONTENT",
    items: [
      { name: "Darsas & Classes", href: "/community/darsas", icon: BookOpen },
      { name: "Inspiration Quote", href: "/community/inspiration", icon: Quote },
      { name: "Friday Khutba", href: "/community/khutba", icon: Mic },
    ],
  },
  {
    title: "SYSTEM & ADMIN",
    items: [
      { name: "Feature Toggles", href: "/settings/features", icon: ToggleRight },
      { name: "Portal Settings", href: "/settings", icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [formData, setFormData] = useState({
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
          setFormData({
            name: userData.full_name || "Administrator",
            email: userData.email || "admin@jmc.org",
            role: userData.role || "Super Admin",
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
        "fixed left-0 top-0 h-screen bg-[#0F172A] text-slate-200 z-50 transition-all duration-300 ease-in-out w-72 border-r border-slate-800/80 shadow-2xl flex flex-col backdrop-blur-xl",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-slate-800/90 p-1.5 border border-amber-500/30 group-hover:border-amber-500/60 shadow-lg shadow-amber-500/10 transition-all duration-300 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="JMC Logo"
              width={36}
              height={36}
              className="object-contain transform group-hover:scale-105 transition-transform"
              priority
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                JAMIA MOSQUE
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-500" /> Executive Portal
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {MENU_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm",
                      isActive
                        ? "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 font-semibold border-l-4 border-amber-500 shadow-md shadow-amber-500/5"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          "p-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-800/50 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-800"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span>{item.name}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={clsx(
                          "px-2 py-0.5 text-[10px] font-semibold rounded-full border shadow-sm",
                          item.badgeColor || "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-4 h-4 text-amber-400/70" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer User Profile Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-amber-500/30 transition-all duration-200">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20">
                {formData.name.charAt(0)}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-100 truncate flex items-center gap-1">
                {formData.name}
              </p>
              <p className="text-[11px] text-amber-400/90 font-medium truncate">
                {formData.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

