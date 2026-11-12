import React from "react";
import { Mic, CalendarDays, Newspaper, Heart, CheckCircle2, Sparkles } from "lucide-react";

export function NotifIcon({ type }: { type?: string | null }) {
  switch (type) {
    case "khutba":
      return <div className="p-2 bg-amber-50 text-amber-600 rounded-lg flex-shrink-0"><Mic className="w-4 h-4" /></div>;
    case "event":
      return <div className="p-2 bg-sky-50 text-sky-600 rounded-lg flex-shrink-0"><CalendarDays className="w-4 h-4" /></div>;
    case "bulletin":
      return <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0"><Newspaper className="w-4 h-4" /></div>;
    case "donation":
      return <div className="p-2 bg-rose-50 text-rose-600 rounded-lg flex-shrink-0"><Heart className="w-4 h-4" /></div>;
    case "admin_donation":
      return <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></div>;
    default:
      return <div className="p-2 bg-purple-50 text-purple-600 rounded-lg flex-shrink-0"><Sparkles className="w-4 h-4" /></div>;
  }
}

