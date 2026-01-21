"use client";

import {
  getCategories,
  getCategoryById,
  getDonationDrives,
  getTransactions,
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
import api from "@/lib/api";
import { CategoryData, DonationDrive } from "@/lib/data";

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
  const [donationTrends, setDonationTrends] = useState([]);
  const [drives, setDrives] = useState<DonationDrive[]>([]);

  useEffect(() => {
    const fetchDrives = async () => {
      const drives = await getDonationDrives();
      setDrives(drives);
    };
    fetchDrives();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Summary
        const summaryRes = await api.get("/api/v1/analytics/summary/");
        setStats({
          totalCollected: summaryRes.data.total_collected,
          totalCollectedWeek: summaryRes.data.total_collected_week,
          totalCollectedMonth: summaryRes.data.total_collected_month,
          activeDrives: summaryRes.data.active_drives,
        });
        setDonationTrends(summaryRes.data.donation_trends);

        // Fetch Categories
        const categoriesRes = await getCategories();
        setCategoryStats(categoriesRes);

        // Fetch Recent Transactions
        const transactionsRes = (await getTransactions()).slice(0, 5);
        setRecentDonations(transactionsRes);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
        />
        <StatCard
          title="Total Collected (Week)"
          value={`KES ${stats.totalCollectedWeek.toLocaleString()}`}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Collected (Month)"
          value={`KES ${stats.totalCollectedMonth.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Active Drives"
          value={stats.activeDrives.toString()}
          icon={Users}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <DonationChart data={donationTrends} />
        </motion.div>
        <motion.div variants={item}>
          <CategoryPieChart data={categoryStats} />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Active Donation Drives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => (
            <DriveProgressCard key={drive.id} drive={drive} />
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <RecentDonationsTable transactions={recentDonations} />
        </motion.div>
        <motion.div variants={item}>
          <RatingAnalysis />
        </motion.div>
      </div>
    </motion.div>
  );
}
