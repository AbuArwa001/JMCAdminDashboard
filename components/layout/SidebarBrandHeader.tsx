"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ChevronLeft, X } from "lucide-react";

interface Props {
  isCollapsed: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  onLinkClick: () => void;
}

export function SidebarBrandHeader({ isCollapsed, onClose, onToggleCollapse, onLinkClick }: Props) {
  return (
    <div className="p-4 border-b border-[#2d2520] bg-[#120e0c] flex items-center justify-between flex-shrink-0 h-16">
      {isCollapsed ? (
        <div className="w-full flex items-center justify-center relative group">
          <Link href="/" onClick={onLinkClick} className="relative w-10 h-10 rounded-xl bg-[#1a1512] border border-[#c99335]/40 hover:border-[#c99335] p-1 flex items-center justify-center shadow-lg transition-all">
            <Image src="/logo.png" alt="JMC Logo" width={30} height={30} className="object-contain" priority />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
          </Link>
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#120e0c] border border-[#c99335]/40 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[70]">
            Jamia Mosque Executive Portal
          </div>
        </div>
      ) : (
        <>
          <Link href="/" onClick={onLinkClick} className="flex items-center gap-3 group min-w-0">
            <div className="relative w-10 h-10 rounded-xl bg-[#1a1512] border border-[#c99335]/40 group-hover:border-[#c99335]/70 p-1 flex items-center justify-center shadow-lg transition-all flex-shrink-0">
              <Image src="/logo.png" alt="JMC Logo" width={32} height={32} className="object-contain group-hover:scale-105 transition-transform" priority />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
            </div>
            <div className="overflow-hidden">
              <span className="block font-bold text-sm tracking-wide text-white leading-tight truncate">JAMIA MOSQUE</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#c99335] uppercase tracking-widest truncate">
                <ShieldCheck className="w-2.5 h-2.5 flex-shrink-0" /> Executive Portal
              </span>
            </div>
          </Link>

          <button type="button" onClick={onToggleCollapse} className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-[#c99335] hover:bg-white/10 transition-colors" aria-label="Retract sidebar">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
