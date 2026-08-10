import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { getDonationTrends } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendingUp, Calendar, Sparkles } from "lucide-react";
import clsx from "clsx";

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

  const totalAmount = displayData.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-[430px] flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg">
              Donation Flow Trends
            </h3>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time financial breakdown • KES {totalAmount.toLocaleString()} total in window
          </p>
        </div>

        {/* Executive Period Switcher */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 w-fit">
          {[
            { id: "week", label: "Week" },
            { id: "month", label: "Month" },
            { id: "year", label: "Year" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={clsx(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
                period === item.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-[320px] flex items-end justify-between gap-3 px-2 pt-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full rounded-2xl"
              style={{ height: `${Math.random() * 60 + 30}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-[320px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BE9830" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#BE9830" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#F1F5F9"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                tickFormatter={(value) => `K${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(190, 152, 48, 0.3)",
                  boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
                  padding: "12px 16px",
                  color: "#fff",
                }}
                cursor={{
                  stroke: "#BE9830",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
                formatter={(value: number) => [
                  <span key="val" className="font-extrabold text-amber-400 text-sm">
                    KES {value.toLocaleString()}
                  </span>,
                  <span key="lbl" className="text-slate-400 text-[11px]">Donations</span>,
                ]}
                labelStyle={{
                  color: "#94A3B8",
                  fontSize: "11px",
                  fontWeight: "700",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#BE9830"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#goldGradient)"
                dot={{ fill: "#0F172A", strokeWidth: 3, r: 5, stroke: "#BE9830" }}
                activeDot={{
                  r: 8,
                  strokeWidth: 4,
                  stroke: "#BE9830",
                  fill: "#FCD34D",
                }}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

