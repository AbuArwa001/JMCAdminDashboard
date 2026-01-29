"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { CategoryData } from "@/lib/data";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

interface CategoryPieChartProps {
  data: CategoryData[];
  isLoading?: boolean;
}

export default function CategoryPieChart({
  data,
  isLoading,
}: CategoryPieChartProps) {
  // Calculate total amount for each category
  // console.log("CategoryPieChart data:", data);
  const chartData = (Array.isArray(data) ? data : [])
    .map((category) => {
      let totalAmount = 0;
      if (category.total_amount !== undefined) {
        totalAmount = category.total_amount;
      } else if (Array.isArray(category.donations)) {
        totalAmount = category.donations.reduce(
          (sum, donation) => sum + (donation.collected_amount || 0),
          0,
        );
      }

      return {
        name: category.category_name,
        value: totalAmount,
        color: category.color,
      };
    })
    .filter((item) => item.value > 0);
  // console.log("CategoryPieChart data:", data);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 italic-font">
          Donations by Category
        </h3>
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[85%]">
          <Skeleton className="w-48 h-48 rounded-full" />
          <div className="mt-8 flex gap-4">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={0}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `KES ${value.toLocaleString()}`,
                "Amount",
              ]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                padding: "12px",
              }}
              itemStyle={{ fontWeight: "600", fontSize: "12px" }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs font-semibold text-gray-500 ml-1 hover:text-gray-900 transition-colors">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
