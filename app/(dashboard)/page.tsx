"use client";

import { useRBAC } from "@/hooks/useRBAC";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { ContentManagerWorkspace } from "@/components/dashboard/ContentManagerWorkspace";
import { ExecutiveStatsGrid } from "@/components/dashboard/ExecutiveStatsGrid";
import { ActiveDrivesSection } from "@/components/dashboard/ActiveDrivesSection";
import DonationChart from "@/components/dashboard/DonationChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import RatingAnalysis from "@/components/dashboard/RatingAnalysis";

export default function Home() {
  const { isSuperAdmin, hasPermission, isLoading: rbacLoading } = useRBAC();
  const canView = isSuperAdmin || hasPermission("dashboard.view");
  const { stats, recentDonations, setRecentDonations, categoryStats, donationTrends, drives, isLoading } = useDashboardData(canView);

  if (rbacLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-[#c99335] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!canView) return <ContentManagerWorkspace />;

  return (
    <div className="space-y-8 pb-10">
      <ExecutiveStatsGrid isSuperAdmin={isSuperAdmin} stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><DonationChart data={donationTrends} isLoading={isLoading} /></div>
        <div><CategoryPieChart data={categoryStats} isLoading={isLoading} /></div>
      </div>

      <ActiveDrivesSection drives={drives} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentDonationsTable
            transactions={recentDonations}
            isLoading={isLoading}
            onTransactionDeleted={(id) => setRecentDonations((p) => p.filter((t) => t.id !== id))}
            onTransactionsBulkDeleted={(ids) => setRecentDonations((p) => p.filter((t) => !ids.includes(t.id)))}
            onTransactionUpdated={(up) => setRecentDonations((p) => p.map((t) => (t.id === up.id ? { ...t, ...up } : t)))}
          />
        </div>
        <div><RatingAnalysis isLoading={isLoading} /></div>
      </div>
    </div>
  );
}
