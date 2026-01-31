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
      className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 h-[400px] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-secondary-dark tracking-tight">
            Donations by Category
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Distribution by fund type
          </p>
        </div>

        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(190,152,48,0.5)]" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[85%]">
          <Skeleton className="w-48 h-48 rounded-full" />
          <div className="mt-8 flex gap-4">
            <Skeleton className="w-20 h-4 rounded-full" />
            <Skeleton className="w-20 h-4 rounded-full" />
            <Skeleton className="w-20 h-4 rounded-full" />
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={6}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
              stroke="none"
              cornerRadius={6}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  strokeWidth={0}
                  className="hover:opacity-80 transition-opacity cursor-pointer filter drop-shadow-sm"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                <span className="font-bold text-gray-900">
                  KES {value.toLocaleString()}
                </span>,
                <span className="text-gray-500 text-xs">Amount</span>,
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(229, 231, 235, 0.5)",
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                padding: "12px 16px",
              }}
              itemStyle={{ fontWeight: "600", fontSize: "12px" }}
              labelStyle={{
                fontWeight: "bold",
                marginBottom: "4px",
                color: "#374151",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs font-semibold text-gray-500 ml-1 hover:text-gray-900 transition-colors uppercase tracking-wide">
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
