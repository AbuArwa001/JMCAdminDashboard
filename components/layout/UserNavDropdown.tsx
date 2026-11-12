"use client";

import { useState } from "react";
import { User as UserIcon, LogOut, UserCheck, KeyRound, Crown, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRBAC } from "@/hooks/useRBAC";

export function UserNavDropdown() {
  const [show, setShow] = useState(false);
  const { user, logout } = useAuth();
  const { staffUser, isSuperAdmin, hasPermission } = useRBAC();

  const roleColor = staffUser?.role?.color || (isSuperAdmin ? "#c99335" : "#10b981");
  const roleName = staffUser?.role?.role_name || (isSuperAdmin ? "Super Admin" : "Staff Member");
  const displayName = staffUser?.full_name || user?.displayName || user?.email?.split("@")[0] || "Administrator";

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="flex items-center gap-2.5 px-2.5 py-1.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all border border-gray-200">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[#1a1512] text-xs shadow-sm" style={{ background: `linear-gradient(135deg, ${roleColor}, #c99335)` }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[140px]">{displayName}</span>
          <div className="flex items-center gap-1">
            {isSuperAdmin && <Crown className="w-2.5 h-2.5 text-[#c99335]" />}
            <span className="text-[10px] font-semibold uppercase tracking-wider leading-tight truncate max-w-[130px]" style={{ color: roleColor }}>{roleName}</span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {show && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShow(false)} />
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-20 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-[#1a1512]/5 via-[#c99335]/5 to-transparent border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate font-medium mt-0.5">{staffUser?.email || user?.email || "admin@jmc.org"}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border" style={{ backgroundColor: `${roleColor}15`, borderColor: `${roleColor}40`, color: roleColor }}>
                  {isSuperAdmin ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  <span>{roleName}</span>
                </div>
              </div>
              <div className="p-1.5 space-y-0.5">
                <a href="/settings" onClick={() => setShow(false)} className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                  <UserIcon className="w-4 h-4 text-gray-500" /> Account &amp; Profile
                </a>
                {(isSuperAdmin || hasPermission("users.manage")) && (
                  <a href="/users" onClick={() => setShow(false)} className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-amber-50 rounded-xl transition-colors">
                    <UserCheck className="w-4 h-4 text-amber-600" /> Staff Management
                  </a>
                )}
                {(isSuperAdmin || hasPermission("roles.manage")) && (
                  <a href="/roles" onClick={() => setShow(false)} className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 rounded-xl transition-colors">
                    <KeyRound className="w-4 h-4 text-emerald-600" /> Roles &amp; Matrix
                  </a>
                )}
                <div className="pt-1 mt-1 border-t border-gray-100">
                  <button onClick={() => logout()} className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4 text-rose-500" /> Sign Out of Portal
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

