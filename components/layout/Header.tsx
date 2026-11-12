"use client";

import { Menu, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { PAGE_TITLES } from "./header-constants";
import { HeaderSearch } from "./HeaderSearch";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserNavDropdown } from "./UserNavDropdown";

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarCollapsed?: boolean;
}

export default function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState("");
  const pageTitle = PAGE_TITLES[pathname] ?? "JMC Portal";

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-30 sticky top-0 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all" aria-label="Toggle navigation">
          <Menu className="w-5 h-5 lg:hidden" />
          <span className="hidden lg:block">
            {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5 text-[#c99335]" /> : <PanelLeftClose className="w-5 h-5 text-gray-400" />}
          </span>
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight tracking-tight">{pageTitle}</h2>
          <p className="text-[10px] text-gray-400 hidden sm:block font-medium">Jamia Mosque Nairobi — Central Management Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <HeaderSearch />
        {currentTime && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {currentTime} EAT
          </div>
        )}
        <NotificationsDropdown />
        <UserNavDropdown />
      </div>
    </header>
  );
}
