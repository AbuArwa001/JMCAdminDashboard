"use client";

import { ACTIVE_DRIVES, DONATION_STATS } from "@/lib/data";
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const [stats, setStats] = useState({
    totalCollected: 0,
    activeDrives: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [donationTrends, setDonationTrends] = useState([]); // We might need to fetch this or calculate it

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Summary
        const summaryRes = await api.get("/api/v1/analytics/summary/");
        setStats({
          totalCollected: summaryRes.data.total_collected,
          activeDrives: summaryRes.data.active_drives,
        });

        // Fetch Categories
        const categoriesRes = await api.get("/api/v1/analytics/categories/");
        // Map category data to chart format
        const mappedCategories = categoriesRes.data.map((cat: any, index: number) => ({
          name: cat.category_name,
          value: cat.total_amount,
          color: ['#BE9830', '#1F2937', '#E5E7EB', '#9CA3AF'][index % 4] // Example colors
        }));
        setCategoryStats(mappedCategories);

        // Fetch Recent Transactions
        const transactionsRes = await api.get("/api/v1/transactions/");
        const mappedTransactions = transactionsRes.data.results.map((t: any) => ({
          id: t.id,
          donorName: t.user ? `User ${t.user}` : "Anonymous", // Ideally fetch user name
          amount: t.amount,
          category: "General", // Transaction doesn't have category directly
          paymentMethod: t.payment_method,
          status: t.status,
          date: t.transaction_date,
        }));
        setRecentDonations(mappedTransactions);

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
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Collected (All Time)"
          value={`KES ${stats.totalCollected.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        {/* Placeholder for other stats until we have API support */}
        <StatCard
          title="Total Collected (Week)"
          value="-"
          icon={TrendingUp}
        />
        <StatCard
          title="Total Collected (Month)"
          value="-"
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Donation Drives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACTIVE_DRIVES.map((drive) => (
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
