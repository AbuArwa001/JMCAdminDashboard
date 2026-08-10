import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "green" | "bronze" | "blue";
  isLoading?: boolean;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  isLoading,
  subtitle,
}: StatCardProps) {
  const iconGradients = {
    primary: "from-amber-500 via-amber-400 to-yellow-300 text-slate-950 shadow-amber-500/20",
    green: "from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 shadow-emerald-500/20",
    bronze: "from-amber-700 via-amber-600 to-amber-500 text-white shadow-amber-700/20",
    blue: "from-indigo-500 via-blue-400 to-sky-300 text-slate-950 shadow-blue-500/20",
  };

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-28 h-3 rounded-md" />
          <Skeleton className="w-36 h-8 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 hover:border-amber-500/40 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.18)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Subtle Background Accent Mesh Glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-2xl group-hover:from-amber-500/15 transition-all duration-500 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={clsx(
            "w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110",
            iconGradients[color]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-all duration-200",
              trend.isPositive
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            )}
            <span>{trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
          {title}
        </p>
        <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

