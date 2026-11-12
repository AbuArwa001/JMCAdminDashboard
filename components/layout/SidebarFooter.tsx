"use client";

import { LogOut, Crown } from "lucide-react";
import clsx from "clsx";

interface Props {
  isCollapsed: boolean;
  displayName: string;
  roleName: string;
  roleColor: string;
  isSuperAdmin: boolean;
  onLogout: () => void;
}

export function SidebarFooter({ isCollapsed, displayName, roleName, roleColor, isSuperAdmin, onLogout }: Props) {
  if (isCollapsed) {
    return (
      <div className="border-t border-[#2d2520] bg-[#120e0c] flex-shrink-0 p-3 space-y-3">
        <div className="relative group mx-auto flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#1a1512] font-bold text-sm shadow-md" style={{ background: `linear-gradient(135deg, ${roleColor}, #c99335)` }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
          <div className="absolute left-full ml-3 bottom-0 z-[70] hidden group-hover:flex flex-col pointer-events-none">
            <div className="bg-[#120e0c] border border-[#c99335]/40 text-white rounded-lg p-2.5 shadow-2xl whitespace-nowrap">
              <p className="text-xs font-bold text-gray-100">{displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isSuperAdmin && <Crown className="w-3 h-3 text-[#c99335] flex-shrink-0" />}
                <p className="text-[10px] font-semibold tracking-wide" style={{ color: roleColor }}>{roleName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative group mx-auto flex items-center justify-center">
          <button type="button" onClick={onLogout} className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-300 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/70 transition-all shadow-sm active:scale-95" aria-label="Sign Out Session">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-[#2d2520] bg-[#120e0c] flex-shrink-0 p-4 space-y-3">
      <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl bg-white/5 border border-white/10">
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[#1a1512] font-bold text-sm shadow-md" style={{ background: `linear-gradient(135deg, ${roleColor}, #c99335)` }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
        </div>
        <div className="overflow-hidden flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-100 truncate">{displayName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isSuperAdmin && <Crown className="w-3 h-3 text-[#c99335] flex-shrink-0" />}
            <p className="text-[10px] font-semibold truncate tracking-wide" style={{ color: roleColor }}>{roleName}</p>
          </div>
        </div>
      </div>

      <button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/60 rounded-xl transition-all shadow-sm active:scale-98">
        <LogOut className="w-3.5 h-3.5" />
        Sign Out Session
      </button>
    </div>
  );
}

