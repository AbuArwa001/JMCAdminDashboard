"use client";

import { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { toast } from "sonner";

export function BrowserPushCard() {
  const [permission, setPermission] = useState("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser notifications are not supported.");
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === "granted") toast.success("Browser push notifications enabled!");
      else if (res === "denied") toast.error("Notifications blocked in browser settings.");
    } catch {
      toast.error("Could not request permissions.");
    }
  };

  const badgeColor =
    permission === "granted"
      ? "bg-emerald-100 text-emerald-800"
      : permission === "denied"
      ? "bg-red-100 text-red-800"
      : "bg-amber-100 text-amber-800";

  return (
    <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Browser Push Notifications</p>
            <p className="text-[11px] text-gray-500">Receive instant desktop alerts for critical events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
            {permission}
          </span>
          {permission !== "granted" && (
            <button type="button" onClick={requestPermission} className="btn-primary text-xs py-1 px-3">
              Enable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

