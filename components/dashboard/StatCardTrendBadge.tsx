import { TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface Props {
  value: number;
  isPositive: boolean;
}

export function StatCardTrendBadge({ value, isPositive }: Props) {
  return (
    <div
      className={clsx(
        "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow-sm transition-all duration-200",
        isPositive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-rose-500/10 text-rose-600 border-rose-500/20"
      )}
    >
      {isPositive ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
      <span>{isPositive ? "+" : "-"}{Math.abs(value)}%</span>
    </div>
  );
}
