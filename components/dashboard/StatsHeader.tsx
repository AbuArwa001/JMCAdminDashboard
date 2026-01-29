"use client";
import { motion } from "framer-motion";
import { Layers, TrendingUp, Award, DollarSign } from "lucide-react";

interface StatsHeaderProps {
  totalCategories: number;
  topCategory: { name: string; value: number };
  totalAmount: number;
}

export default function StatsHeader({
  totalCategories,
  topCategory,
  totalAmount,
}: StatsHeaderProps) {
  const stats = [
    {
      label: "Total Categories",
      value: totalCategories,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Top Performer",
      value: topCategory.name || "N/A",
      subValue: `KES ${topCategory.value?.toLocaleString()}`,
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Collection",
      value: `KES ${totalAmount?.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Growth",
      value: "+12.5%",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            {stat.subValue && (
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                {stat.subValue}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {stat.label}
            </p>
            <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
