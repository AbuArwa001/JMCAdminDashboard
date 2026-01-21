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

interface CategoryPieChartProps {
  data: CategoryData[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="font-bold text-gray-900 mb-6">Donations by Category</h3>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `KES ${value.toLocaleString()}`,
              "Total Donated",
            ]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-500 ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
