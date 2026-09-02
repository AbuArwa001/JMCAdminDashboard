"use client";

import {
  getCategories,
  getCategoryById,
  getDonationDrives,
  getTransactions,
  getAnalyticsSummary,
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
        const [summaryData, categoriesRes, allTransactions] = await Promise.all([
          getAnalyticsSummary(),
          getCategories(),
          getTransactions(),
        ]);

        setStats({
          totalCollected: summaryData.total_collected,
          totalCollectedWeek: summaryData.total_collected_week,
          totalCollectedMonth: summaryData.total_collected_month,
          activeDrives: summaryData.active_drives,
        });
        setDonationTrends(summaryData.donation_trends);

        setCategoryStats(categoriesRes);

        const categoryMap = categoriesRes.reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.category_name;
          return acc;
        }, {});

        const transactionsRes = allTransactions.slice(0, 5).map((t: any) => ({
          ...t,
          category: categoryMap[t.donation?.category] || "General",
          user_name: t.user?.full_name || "Anonymous",
        }));
        setRecentDonations(transactionsRes);

        const rawDrives = await getDonationDrives();
        const mappedDrives = rawDrives.map(drive => ({
          ...drive,
          categoryName: categoryMap[drive.category] || "Loading..."
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

