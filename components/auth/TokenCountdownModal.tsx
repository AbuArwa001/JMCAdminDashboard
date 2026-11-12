"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, LogOut, AlertTriangle, Clock, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useTokenCountdown } from "@/hooks/use-token-countdown";
import { CountdownTimerDisplay } from "./CountdownTimerDisplay";

export default function TokenCountdownModal() {
  const { isOpen, timeLeft, totalWarningTime, isRefreshing, handleExtend, handleLogout, isUrgent } = useTokenCountdown();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1a1512]/85 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 16 }} className="relative w-full max-w-md bg-[#120e0c] border border-[#c99335]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
            <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
              <div className={clsx("absolute inset-0 rounded-full animate-ping opacity-25", isUrgent ? "bg-rose-500" : "bg-[#c99335]")} />
              <div className={clsx("relative w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-xl", isUrgent ? "bg-rose-950/60 border-rose-500/70 text-rose-400" : "bg-[#1a1512] border-[#c99335]/60 text-[#c99335]")}>
                {isUrgent ? <AlertTriangle className="w-9 h-9 animate-bounce" /> : <Clock className="w-9 h-9 animate-pulse" />}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-wide mb-2" style={{ fontFamily: "var(--font-cinzel), serif" }}>Session Expiring Soon</h3>
            <p className="text-sm text-gray-300 font-sans leading-relaxed px-2">Your security session is nearing expiration. To maintain access and protect administrative operations, please confirm you would like to stay signed in.</p>

            <CountdownTimerDisplay timeLeft={timeLeft} totalWarningTime={totalWarningTime} isUrgent={isUrgent} />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleLogout} disabled={isRefreshing} className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#1e1916] hover:bg-[#28211d] text-gray-300 text-xs font-semibold tracking-wider uppercase border border-[#2d2520]">
                <LogOut className="w-4 h-4 text-gray-400" />
                Sign Out
              </button>
              <button onClick={handleExtend} disabled={isRefreshing} className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#c99335] to-[#e39e3b] text-[#1a1512] text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#c99335]/20 disabled:opacity-50">
                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin text-[#1a1512]" /> : <RotateCw className="w-4 h-4 text-[#1a1512]" />}
                {isRefreshing ? "Extending..." : "Stay Signed In"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
