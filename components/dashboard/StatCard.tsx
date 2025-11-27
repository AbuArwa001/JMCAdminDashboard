import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "primary" | "green" | "bronze" | "blue";
}

export default function StatCard({ title, value, icon: Icon, trend, color = "primary" }: StatCardProps) {
    const colorClasses = {
        primary: "bg-primary/10 text-primary",
        green: "bg-primary-green/10 text-primary-green",
        bronze: "bg-primary-bronze/10 text-primary-bronze",
        blue: "bg-blue-500/10 text-blue-600",
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={clsx("p-3 rounded-lg", colorClasses[color])}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={clsx("text-xs font-medium px-2 py-1 rounded-full",
                        trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {trend.isPositive ? "+" : "-"}{trend.value}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
        </div>
    );
}
