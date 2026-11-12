import { useState, useEffect } from "react";
import { getCategories, getDonationDrives, getTransactions, getAnalyticsSummary, getAnalyticsCategories } from "@/lib/api_data";
import { CategoryData, DonationDrive, DonationTrend, Transaction } from "@/lib/data";

export function useDashboardData(enabled: boolean) {
  const [stats, setStats] = useState({ totalCollected: 0, totalCollectedWeek: 0, totalCollectedMonth: 0, activeDrives: 0 });
  const [recentDonations, setRecentDonations] = useState<Transaction[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!enabled) { setIsLoading(false); return; }
    Promise.all([
      getAnalyticsSummary().catch(() => ({ total_collected: 0, total_collected_week: 0, total_collected_month: 0, active_drives: 0, donation_trends: [] })),
      getCategories().catch(() => []),
      getTransactions().catch(() => []),
      getAnalyticsCategories().catch(() => []),
      getDonationDrives().catch(() => []),
    ]).then(([summary, cats, txs, aCats, rawDrives]) => {
      setStats({ totalCollected: summary?.total_collected || 0, totalCollectedWeek: summary?.total_collected_week || 0, totalCollectedMonth: summary?.total_collected_month || 0, activeDrives: summary?.active_drives || 0 });
      setDonationTrends(summary?.donation_trends || []);
      const catMap = (cats || []).reduce((acc: any, c: any) => ({ ...acc, [c.id]: c.category_name }), {});
      setCategoryStats(aCats?.length ? aCats : cats);
      setRecentDonations((txs || []).slice(0, 5).map((t: any) => ({ ...t, category: catMap[t.donation?.category_id] || "General" })));
      setDrives((rawDrives || []).map((d: any) => ({ ...d, categoryName: catMap[d.category_id || d.category] || "General" })));
    }).finally(() => setIsLoading(false));
  }, [enabled]);

  return { stats, recentDonations, setRecentDonations, categoryStats, donationTrends, drives, isLoading };
}
