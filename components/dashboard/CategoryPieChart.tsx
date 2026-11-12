"use client";

import { CategoryData } from "@/lib/data";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { PieChart as PieIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { CategoryDonutChart } from "./CategoryDonutChart";
import { CategoryLegendList } from "./CategoryLegendList";

interface CategoryPieChartProps {
  data: CategoryData[];
  isLoading?: boolean;
}

const LUXURY_PALETTE = ["#BE9830", "#10B981", "#6366F1", "#F59E0B", "#EC4899", "#8B5CF6"];

export default function CategoryPieChart({ data, isLoading }: CategoryPieChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const chartData = (Array.isArray(data) ? data : [])
    .map((cat, idx) => {
      let total = 0;
      if (cat.total_amount !== undefined && cat.total_amount !== null) total = Number(cat.total_amount) || 0;
      else if (Array.isArray(cat.donations)) total = cat.donations.reduce((s, d) => s + (Number(d.collected_amount) || 0), 0);
      return {
        name: cat.category_name || (cat as any).name || "Category",
        value: total,
        color: cat.color || LUXURY_PALETTE[idx % LUXURY_PALETTE.length],
      };
    })
    .filter((item) => item.value > 0);

  const grandTotal = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-[430px] flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg">Category Distribution</h3>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600"><PieIcon className="w-4 h-4" /></span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Breakdown across fund categories</p>
        </div>
        <div className="h-9 w-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </div>

      {isLoading || !isMounted ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-0"><Skeleton className="w-40 h-40 rounded-full" /></div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-0 text-center p-6">
          <p className="text-sm font-bold text-slate-800">No Category Data</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px]">No completed donations recorded under fund categories yet.</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 justify-center gap-4 pt-2">
          <CategoryDonutChart data={chartData} grandTotal={grandTotal} />
          <CategoryLegendList data={chartData} grandTotal={grandTotal} />
        </div>
      )}
    </motion.div>
  );
}
