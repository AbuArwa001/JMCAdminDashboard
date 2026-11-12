"use client";

import { useState, useEffect } from "react";
import { getDonationTrends } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrendingUp } from "lucide-react";
import { DonationChartPeriodSwitcher } from "./DonationChartPeriodSwitcher";
import { DonationAreaChart } from "./DonationAreaChart";

interface DonationChartProps {
  data: any[];
  isLoading?: boolean;
}

export default function DonationChart({ data: initialData, isLoading: parentLoading }: DonationChartProps) {
  const [period, setPeriod] = useState("week");
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  useEffect(() => {
    setIsLoadingInternal(true);
    getDonationTrends(period)
      .then((t) => setFetchedData(t))
      .catch((e) => console.error("Error fetching trends:", e))
      .finally(() => setIsLoadingInternal(false));
  }, [period]);

  const displayData = fetchedData.length > 0 ? fetchedData : (initialData?.length > 0 ? initialData : []);
  const totalAmount = displayData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const isLoading = parentLoading || isLoadingInternal;

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-[430px] flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg">Donation Flow Trends</h3>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time financial breakdown • KES {totalAmount.toLocaleString()} total in window</p>
        </div>
        <DonationChartPeriodSwitcher period={period} onSelect={setPeriod} />
      </div>

      {isLoading ? (
        <div className="w-full h-[320px] flex items-end justify-between gap-3 px-2 pt-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="w-full rounded-2xl" style={{ height: `${Math.random() * 60 + 30}%` }} />
          ))}
        </div>
      ) : (
        <DonationAreaChart data={displayData} />
      )}
    </div>
  );
}
