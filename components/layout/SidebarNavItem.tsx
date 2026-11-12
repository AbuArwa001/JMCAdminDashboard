"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { MenuItem } from "./sidebar-types";

interface Props {
  item: MenuItem;
  isActive: boolean;
  isCollapsed: boolean;
  onLinkClick: () => void;
}

export function SidebarNavItem({ item, isActive, isCollapsed, onLinkClick }: Props) {
  const IconComponent = item.icon;

  if (isCollapsed) {
    return (
      <li className="relative group">
        <Link
          href={item.href}
          onClick={onLinkClick}
          className={clsx(
            "flex items-center justify-center w-11 h-10 mx-auto rounded-xl transition-all duration-150 relative",
            isActive ? "bg-[#c99335]/20 text-[#c99335] border border-[#c99335]/40 shadow-sm" : "text-gray-400 hover:text-white hover:bg-white/10"
          )}
          aria-label={item.name}
        >
          <IconComponent className={clsx("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive ? "text-[#c99335]" : (item.iconColor || "text-gray-400"))} />
          {isActive && <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#c99335] rounded-r-full" />}
        </Link>
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[70] hidden group-hover:flex items-center pointer-events-none">
          <div className="bg-[#120e0c] border border-[#c99335]/40 text-white text-xs font-semibold rounded-lg py-1.5 px-3 shadow-2xl whitespace-nowrap flex items-center gap-2">
            <span>{item.name}</span>
            {item.badge && <span className={clsx("px-1.5 py-0.5 text-[9px] font-semibold rounded border uppercase tracking-wider", item.badgeColor || "bg-amber-500/20 text-amber-300 border-amber-500/40")}>{item.badge}</span>}
          </div>
        </div>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={clsx(
          "flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
          isActive ? "bg-white/10 text-white border-l-4 border-[#c99335] pl-2" : "text-gray-300 hover:bg-white/10 hover:text-white border-l-4 border-transparent pl-2"
        )}
      >
        <div className="flex items-center gap-3">
          <IconComponent className={clsx("w-4 h-4 flex-shrink-0", isActive ? "text-[#c99335]" : (item.iconColor || "text-gray-400"))} />
          <span className="truncate">{item.name}</span>
        </div>
        {item.badge ? (
          <span className={clsx("px-1.5 py-0.5 text-[9px] font-semibold rounded border uppercase tracking-wider", item.badgeColor || "bg-amber-500/20 text-amber-300 border-amber-500/40")}>{item.badge}</span>
        ) : isActive ? (
          <ChevronRight className="w-3.5 h-3.5 text-[#c99335]/70" />
        ) : null}
      </Link>
    </li>
  );
}
