"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { LayoutGrid, Flame } from "lucide-react";
import { CategoryData } from "@/lib/data";

interface Props {
  categories: CategoryData[];
  isLoading?: boolean;
}

export function CategoryQuickPerformance({ categories, isLoading }: Props) {
  const sorted = [...(categories || [])]
    .map((c) => ({ name: c.category_name, value: Number(c.total_amount) || 0, color: c.color || "#BE9830" }))
    .sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, c) => sum + c.value, 0);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-[430px] flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between shrink-0 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg">Quick Performance</h3>
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600"><Flame className="w-4 h-4" /></span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Top performing categories</p>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">Live</span>
      </div>

      <div className="space-y-4 flex-grow overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-50 rounded-full mb-3"><LayoutGrid className="w-6 h-6 text-gray-300" /></div>
            <p className="text-gray-400 font-medium text-xs italic">No performance data yet</p>
          </div>
        ) : (
          sorted.slice(0, 5).map((cat) => {
            const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : "0.0";
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="font-bold text-slate-700 truncate">{cat.name}</span>
                  </div>
                  <span className="font-black text-slate-900 font-mono text-[11px] shrink-0">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 }} className="h-full rounded-full" style={{ backgroundColor: cat.color }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
