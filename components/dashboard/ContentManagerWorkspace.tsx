"use client";

import Link from "next/link";
import { Mic, Newspaper, BookOpen, CalendarDays, HandHeart, BookMarked, Clock, Calculator, Sparkles, Layers, ArrowRight } from "lucide-react";
import { useRBAC } from "@/hooks/useRBAC";

const MODULES = [
  { title: "Friday Khutba", desc: "Publish sermon summaries & recordings", href: "/community/khutba", icon: Mic, bg: "bg-amber-50", color: "text-amber-500", perm: "khutba.manage" },
  { title: "Friday Bulletins", desc: "Upload weekly PDF bulletins", href: "/community/bulletins", icon: Newspaper, bg: "bg-blue-50", color: "text-blue-500", perm: "bulletins.manage" },
  { title: "Darsas & Classes", desc: "Schedule madrasa & study circles", href: "/community/darsas", icon: BookOpen, bg: "bg-teal-50", color: "text-teal-500", perm: "darsas.manage" },
  { title: "Community Events", desc: "Manage mosque programs & events", href: "/community/events", icon: CalendarDays, bg: "bg-sky-50", color: "text-sky-500", perm: "events.manage" },
  { title: "Duas & Supplications", desc: "Curate authentic daily adhkar", href: "/community/duas", icon: HandHeart, bg: "bg-rose-50", color: "text-rose-500", perm: "duas.manage" },
  { title: "Noble Quran", desc: "Audio recitations & translations", href: "/community/quran", icon: BookMarked, bg: "bg-emerald-50", color: "text-emerald-500", perm: "quran.manage" },
  { title: "Prayer Timings", desc: "Timetables & calculation rules", href: "/community/prayer-times", icon: Clock, bg: "bg-amber-50", color: "text-amber-600", perm: "prayer_times.manage" },
  { title: "Zakat Calculator", desc: "Maintain live Nisab thresholds", href: "/community/zakat", icon: Calculator, bg: "bg-green-50", color: "text-green-600", perm: "zakat.manage" },
];

export function ContentManagerWorkspace() {
  const { staffUser, hasPermission } = useRBAC();
  const available = MODULES.filter((m) => hasPermission(m.perm));

  return (
    <div className="space-y-8 pb-12">
      <div className="p-8 bg-gradient-to-r from-[#1a1512] via-[#241c17] to-[#120e0c] rounded-3xl text-white shadow-xl relative border border-[#c99335]/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#c99335] text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Workspace
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: "var(--font-cinzel), serif" }}>
          Welcome back, {staffUser?.full_name || "Officer"}
        </h1>
        <p className="text-sm text-gray-300 font-medium leading-relaxed">Select a module below to publish content and manage resources.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2"><Layers className="w-5 h-5 text-[#c99335]" /> Accessible Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {available.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.href} href={mod.href} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c99335]/40 transition-all group flex flex-col justify-between">
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${mod.bg} ${mod.color}`}><Icon className="w-6 h-6" /></div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#c99335] transition-colors">{mod.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{mod.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#c99335]">
                  <span>Open Module</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
