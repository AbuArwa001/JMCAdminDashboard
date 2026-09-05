"use client";

import {
  getCategories,
  getCategoryById,
  getDonationDrives,
  getTransactions,
  getAnalyticsSummary,
  getAnalyticsCategories,
} from "@/lib/api_data";
import StatCard from "@/components/dashboard/StatCard";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import DonationChart from "@/components/dashboard/DonationChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import RatingAnalysis from "@/components/dashboard/RatingAnalysis";
import { DollarSign, TrendingUp, HeartHandshake, Layers, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CategoryData, DonationDrive, DonationTrend } from "@/lib/data";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalCollectedWeek: 0,
    totalCollectedMonth: 0,
    activeDrives: 0,
  });
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          summaryData,
          categoriesRes,
          allTransactions,
          analyticsCategoriesRes,
          rawDrives,
        ] = await Promise.all([
          getAnalyticsSummary().catch(() => ({
            total_collected: 0,
            total_collected_week: 0,
            total_collected_month: 0,
            active_drives: 0,
            donation_trends: [],
          })),
          getCategories().catch(() => []),
          getTransactions().catch(() => []),
          getAnalyticsCategories().catch(() => []),
          getDonationDrives().catch(() => []),
        ]);

        setStats({
          totalCollected: summaryData?.total_collected || 0,
          totalCollectedWeek: summaryData?.total_collected_week || 0,
          totalCollectedMonth: summaryData?.total_collected_month || 0,
          activeDrives: summaryData?.active_drives || 0,
        });
        setDonationTrends(summaryData?.donation_trends || []);

        const categoryMap = (categoriesRes || []).reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.category_name;
          return acc;
        }, {});

        const driveMap = (rawDrives || []).reduce((acc: any, drive: any) => {
          acc[drive.id] = drive;
          return acc;
        }, {});

        // Calculate category totals from completed transactions
        const categoryTotals: Record<string, number> = {};
        (allTransactions || []).forEach((t: any) => {
          if (t.payment_status === "Completed") {
            const drive =
              t.donation && typeof t.donation === "object"
                ? t.donation
                : driveMap[t.donation_id || t.donation];
            const catId = drive?.category_id || drive?.category;
            if (catId) {
              categoryTotals[catId] =
                (categoryTotals[catId] || 0) + (Number(t.amount) || 0);
            }
          }
        });

        let resolvedCategoryStats: CategoryData[] = [];
        if (
          Array.isArray(analyticsCategoriesRes) &&
          analyticsCategoriesRes.some((c: any) => (Number(c.total_amount) || 0) > 0)
        ) {
          resolvedCategoryStats = analyticsCategoriesRes.map((c: any) => ({
            ...c,
            total_amount: Number(c.total_amount) || 0,
          }));
        } else {
          resolvedCategoryStats = (categoriesRes || []).map((cat: any) => ({
            ...cat,
            total_amount: categoryTotals[cat.id] || 0,
          }));
        }

        setCategoryStats(resolvedCategoryStats);

        const transactionsRes = (allTransactions || [])
          .slice(0, 5)
          .map((t: any) => {
            const drive =
              t.donation && typeof t.donation === "object"
                ? t.donation
                : driveMap[t.donation_id || t.donation];
            const catId = drive?.category_id || drive?.category;
            const categoryName =
              (catId && categoryMap[catId]) ||
              drive?.categoryName ||
              drive?.category_name ||
              (typeof t.category === "string" && t.category ? t.category : "General");
            const rawName =
              t.user?.full_name || t.user_name || t.account_name;
            const donorName =
              rawName && rawName.trim().toLowerCase() !== "anonymous"
                ? rawName.trim()
                : (t.account_name || "Anonymous Donor");

            return {
              ...t,
              donation: drive || t.donation,
              category: categoryName,
              user_name: donorName,
              account_name: t.account_name || donorName,
            };
          });
        setRecentDonations(transactionsRes);

        const mappedDrives = (rawDrives || []).map((drive: any) => ({
          ...drive,
          categoryName:
            categoryMap[drive.category_id || drive.category] || "General",
        }));
        setDrives(mappedDrives);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Executive Stat Cards Row */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Treasury Collected"
          value={`KES ${stats.totalCollected.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 14.8, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Weekly Inflow"
          value={`KES ${stats.totalCollectedWeek.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Monthly Inflow"
          value={`KES ${stats.totalCollectedMonth.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 5.4, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeDrives.toString()}
          icon={HeartHandshake}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <DonationChart data={donationTrends} isLoading={isLoading} />
        </motion.div>
        <motion.div variants={item}>
          <CategoryPieChart data={categoryStats} isLoading={isLoading} />
        </motion.div>
      </div>

      {/* Active Donation Drives Section */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              Active Donation Drives
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Live campaign progress and target metrics
            </p>
          </div>
          <Link
            href="/drives"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            Manage Drives <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <DriveProgressCard key={i} isLoading={true} />
            ))
          ) : (
            drives.slice(0, 3).map((drive) => (
              <DriveProgressCard key={drive.id} drive={drive} />
            ))
          )}
        </div>
      </motion.div>

      {/* Transactions & Ratings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <RecentDonationsTable transactions={recentDonations} isLoading={isLoading} />
        </motion.div>
        <motion.div variants={item}>
          <RatingAnalysis isLoading={isLoading} />
        </motion.div>
      </div>
    </motion.div>
  );
}

