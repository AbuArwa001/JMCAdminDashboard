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
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CategoryData, DonationDrive, DonationTrend } from "@/lib/data";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalCollectedWeek: 0,
    totalCollectedMonth: 0,
    activeDrives: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [categoryStats, setCategoryStats] = useState<CategoryData[]>([]);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch everything in parallel
        const [summaryData, categoriesRes, allTransactions] = await Promise.all([
          getAnalyticsSummary(),
          getCategories(),
          getTransactions(),
        ]);

        // 1. Set Stats & Trends
        setStats({
          totalCollected: summaryData.total_collected,
          totalCollectedWeek: summaryData.total_collected_week,
          totalCollectedMonth: summaryData.total_collected_month,
          activeDrives: summaryData.active_drives,
        });
        setDonationTrends(summaryData.donation_trends);

        // 2. Set Categories
        setCategoryStats(categoriesRes);

        // 3. Create Category Map
        const categoryMap = categoriesRes.reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.category_name;
          return acc;
        }, {});

        // 4. Map and Set Transactions
        const transactionsRes = allTransactions.slice(0, 5).map((t: any) => ({
          ...t,
          category: categoryMap[t.donation?.category] || "General",
          user_name: t.user?.full_name || "Anonymous",
        }));
        setRecentDonations(transactionsRes);

        // 5. Fetch and Map Drives
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
      className="space-y-6"
    >
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Collected (All Time)"
          value={`KES ${stats.totalCollected.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Collected (Week)"
          value={`KES ${stats.totalCollectedWeek.toLocaleString()}`}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Collected (Month)"
          value={`KES ${stats.totalCollectedMonth.toLocaleString()}`}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <StatCard
          title="Active Drives"
          value={stats.activeDrives.toString()}
          icon={Users}
          isLoading={isLoading}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <DonationChart data={donationTrends} isLoading={isLoading} />
        </motion.div>
        <motion.div variants={item}>
          <CategoryPieChart data={categoryStats} isLoading={isLoading} />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Active Donation Drives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <DriveProgressCard key={i} isLoading={true} />
            ))
          ) : (
            drives.map((drive) => (
              <DriveProgressCard key={drive.id} drive={drive} />
            ))
          )}
        </div>
      </motion.div>

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
