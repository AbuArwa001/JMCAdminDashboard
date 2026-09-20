"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CategoryData } from "@/lib/data";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { PieChart as PieIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryPieChartProps {
  data: CategoryData[];
  isLoading?: boolean;
}

const LUXURY_PALETTE = [
  "#BE9830", // Gold
  "#10B981", // Emerald
  "#6366F1", // Indigo
  "#F59E0B", // Amber
  "#EC4899", // Rose
  "#8B5CF6", // Purple
];

export default function CategoryPieChart({
  data,
  isLoading,
}: CategoryPieChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = (Array.isArray(data) ? data : [])
    .map((category, idx) => {
      let totalAmount = 0;
      if (category.total_amount !== undefined && category.total_amount !== null) {
        totalAmount = Number(category.total_amount) || 0;
      } else if (Array.isArray(category.donations)) {
        totalAmount = category.donations.reduce(
          (sum, donation) => sum + (Number(donation.collected_amount) || 0),
          0,
        );
      }

      const name = category.category_name || (category as any).name || "Category";

      return {
        name,
        value: totalAmount,
        color: category.color || LUXURY_PALETTE[idx % LUXURY_PALETTE.length],
      };
    })
    .filter((item) => item.value > 0);

  const grandTotal = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-[430px] flex flex-col justify-between overflow-hidden"
    >
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg">
              Category Distribution
            </h3>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600">
              <PieIcon className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Breakdown across fund categories
          </p>
        </div>

        <div className="h-9 w-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_rgba(190,152,48,0.6)]" />
        </div>
      </div>

      {isLoading || !isMounted ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-0">
          <Skeleton className="w-40 h-40 rounded-full" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="w-16 h-3 rounded-full" />
            <Skeleton className="w-16 h-3 rounded-full" />
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 min-h-0 text-center p-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
            <PieIcon className="w-7 h-7 text-amber-500/70" />
          </div>
          <p className="text-sm font-bold text-slate-800">No Category Data</p>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
            No completed donations recorded under fund categories yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 justify-between pt-1">
          {/* Donut Chart with Center Total Badge */}
          <div className="relative h-[175px] w-full shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1200}
                  stroke="none"
                  cornerRadius={6}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                      className="hover:opacity-80 transition-all cursor-pointer filter drop-shadow-sm"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    <span key="val" className="font-extrabold text-amber-400 text-sm">
                      KES {value.toLocaleString()}
                    </span>,
                    <span key="lbl" className="text-slate-400 text-xs">Total Fund</span>,
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(190, 152, 48, 0.3)",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
                    padding: "12px 16px",
                    color: "#fff",
                  }}
                  itemStyle={{ fontWeight: "700", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total inside Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <span className="text-xs font-extrabold text-slate-800 font-mono">
                {grandTotal >= 1_000_000
                  ? `KES ${(grandTotal / 1_000_000).toFixed(1)}M`
                  : grandTotal >= 1_000
                  ? `KES ${(grandTotal / 1_000).toFixed(0)}k`
                  : `KES ${grandTotal.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* Custom Scrollable Category Legend with Percentages */}
          <div className="max-h-[135px] overflow-y-auto pr-1 space-y-1 mt-1">
            {chartData.map((entry, index) => {
              const percentage =
                grandTotal > 0 ? Math.round((entry.value / grandTotal) * 100) : 0;
              return (
                <div
                  key={`legend-${index}`}
                  className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors group text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span
                      className="font-medium text-slate-700 truncate group-hover:text-amber-600 transition-colors"
                      title={entry.name}
                    >
                      {entry.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono text-[11px] shrink-0">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

