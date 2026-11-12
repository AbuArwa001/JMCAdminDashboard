"use client";

import { Search, Command } from "lucide-react";

export function HeaderSearch() {
  return (
    <div className="relative hidden md:block">
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search donations, drives, members..."
        className="w-64 lg:w-80 pl-9 pr-12 py-1.5 bg-gray-100/80 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#c99335]/30 focus:border-[#c99335] transition-all"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const target = e.target as HTMLInputElement;
            window.location.href = `/donations?search=${encodeURIComponent(target.value)}`;
          }
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-bold text-gray-400 bg-gray-200/80 px-1.5 py-0.5 rounded">
        <Command className="w-2.5 h-2.5" /> K
      </div>
    </div>
  );
}

