import React from "react";
import { Clock } from "lucide-react";
import clsx from "clsx";
import { formatTimeMMSS } from "@/lib/token-utils";

interface Props {
  timeLeft: number;
  totalWarningTime: number;
  isUrgent: boolean;
}

export function CountdownTimerDisplay({ timeLeft, totalWarningTime, isUrgent }: Props) {
  const progressRatio = totalWarningTime > 0 ? Math.max(0, Math.min(100, (timeLeft / totalWarningTime) * 100)) : 0;

  return (
    <div className={clsx("rounded-2xl p-5 my-6 border flex flex-col items-center justify-center shadow-inner", isUrgent ? "bg-rose-950/30 border-rose-500/50" : "bg-[#161210] border-[#2d2520]")}>
      <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-[#c99335]" />
        Time Remaining Before Logout
      </span>
      <div className={clsx("text-5xl font-mono font-bold tracking-widest my-1 transition-all", isUrgent ? "text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse" : "text-[#c99335] drop-shadow-[0_2px_12px_rgba(201,147,53,0.3)]")}>
        {formatTimeMMSS(timeLeft)}
      </div>
      <div className="w-full bg-[#1e1916] h-2 rounded-full mt-3 overflow-hidden border border-[#2d2520]">
        <div
          className={clsx("h-full transition-all duration-1000 rounded-full", isUrgent ? "bg-rose-500" : "bg-gradient-to-r from-[#c99335] to-[#e39e3b]")}
          style={{ width: `${progressRatio}%` }}
        />
      </div>
    </div>
  );
}

