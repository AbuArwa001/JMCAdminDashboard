import { DollarSign, TrendingUp, HeartHandshake, Crown, UserCheck, KeyRound } from "lucide-react";
import Link from "next/link";
import StatCard from "./StatCard";

interface Props {
  isSuperAdmin: boolean;
  stats: { totalCollected: number; totalCollectedWeek: number; totalCollectedMonth: number; activeDrives: number };
  isLoading: boolean;
}

export function ExecutiveStatsGrid({ isSuperAdmin, stats, isLoading }: Props) {
  return (
    <div className="space-y-6">
      {isSuperAdmin && (
        <div className="p-4 px-6 bg-gradient-to-r from-[#1a1512] via-[#241c17] to-[#120e0c] rounded-2xl text-white shadow-lg border border-[#c99335]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c99335]/20 text-[#c99335] border border-[#c99335]/30 flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Super Administrator Mode Active <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-[11px] text-gray-300 font-medium">Full root clearance enabled • Role-Based Access Control operational</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/users" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all">
              <UserCheck className="w-3.5 h-3.5 text-[#c99335]" /> Manage Staff
            </Link>
            <Link href="/roles" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c99335] hover:bg-[#e39e3b] text-xs font-bold text-[#1a1512] transition-all">
              <KeyRound className="w-3.5 h-3.5" /> Roles Matrix
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Treasury Collected" value={`KES ${stats.totalCollected.toLocaleString()}`} icon={DollarSign} trend={{ value: 14.8, isPositive: true }} isLoading={isLoading} />
        <StatCard title="Weekly Inflow" value={`KES ${stats.totalCollectedWeek.toLocaleString()}`} icon={TrendingUp} trend={{ value: 8.2, isPositive: true }} isLoading={isLoading} />
        <StatCard title="Monthly Inflow" value={`KES ${stats.totalCollectedMonth.toLocaleString()}`} icon={DollarSign} trend={{ value: 5.4, isPositive: true }} isLoading={isLoading} />
        <StatCard title="Active Campaigns" value={stats.activeDrives.toString()} icon={HeartHandshake} isLoading={isLoading} />
      </div>
    </div>
  );
}
