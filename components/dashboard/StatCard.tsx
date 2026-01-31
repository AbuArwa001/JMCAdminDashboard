import { LucideIcon } from "lucide-react";
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
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  isLoading,
}: StatCardProps) {
  const colorClasses = {
    primary:
      "bg-gradient-to-br from-primary/20 to-primary-bronze/5 text-primary-bronze",
    green: "bg-green-50 text-green-600",
    bronze: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-12 h-6 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-32 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={clsx(
            "p-3.5 rounded-xl transition-transform group-hover:scale-110 duration-300",
            colorClasses[color],
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={clsx(
              "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1",
              trend.isPositive
                ? "bg-green-50 text-green-700 border border-green-100"
                : "bg-red-50 text-red-700 border border-red-100",
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium tracking-wide uppercase text-[10px] mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-secondary-dark tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}
