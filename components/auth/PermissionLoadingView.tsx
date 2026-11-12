import React from "react";
import { Lock } from "lucide-react";

export function PermissionLoadingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#c99335]/20 to-[#e39e3b]/10 animate-pulse border border-[#c99335]/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-6 h-6 text-[#c99335] animate-bounce" />
        </div>
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Verifying Security Clearance...
      </p>
    </div>
  );
}
