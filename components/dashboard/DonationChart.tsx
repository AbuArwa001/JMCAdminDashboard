import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { getDonationTrends } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";

interface DonationChartProps {
  data: any[];
  isLoading?: boolean;
}

export default function DonationChart({
  data: initialData,
  isLoading: parentLoading,
}: DonationChartProps) {
  const [period, setPeriod] = useState("week");
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  const isLoading = parentLoading || isLoadingInternal;

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoadingInternal(true);
      try {
        const trends = await getDonationTrends(period);
        setFetchedData(trends);
      } catch (error) {
        console.error("Error fetching trends:", error);
        // Keep using initialData or fallback if fetch fails
      } finally {
        setIsLoadingInternal(false);
      }
    };

    fetchTrends();
  }, [period]);

  const displayData =
    fetchedData.length > 0
      ? fetchedData
      : initialData?.length > 0
        ? initialData
        : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-secondary-dark tracking-tight">
            Donation Trends
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Overview of contributions over time
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-xs font-semibold bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {isLoading ? (
        <div className="w-full h-[85%] flex items-end justify-between gap-2 px-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-t-lg"
              style={{ height: `${Math.random() * 60 + 20}%` }}
            />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={displayData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#BE9830" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#BE9830" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => `K${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(229, 231, 235, 0.5)",
                boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.1)",
                padding: "12px 16px",
              }}
              cursor={{
                stroke: "#BE9830",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              formatter={(value: number) => [
                <span className="font-bold text-gray-900">
                  KES {value.toLocaleString()}
                </span>,
                <span className="text-gray-500 text-xs">Amount</span>,
              ]}
              labelStyle={{
                color: "#6B7280",
                fontSize: "11px",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#BE9830"
              strokeWidth={3}
              dot={{ fill: "#white", strokeWidth: 3, r: 6, stroke: "#BE9830" }}
              activeDot={{
                r: 8,
                strokeWidth: 4,
                stroke: "#BE9830",
                fill: "white",
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
