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
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Collected (Today)"
          value={`KES ${DONATION_STATS.totalCollectedToday.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Collected (Week)"
          value={`KES ${DONATION_STATS.totalCollectedWeek.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Collected (Month)"
          value={`KES ${DONATION_STATS.totalCollectedMonth.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Active Drives"
          value={ACTIVE_DRIVES.length.toString()}
          icon={Users}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <DonationChart />
        </motion.div>
        <motion.div variants={item}>
          <CategoryPieChart />
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
          <RecentDonationsTable />
        </motion.div>
        <motion.div variants={item}>
          <RatingAnalysis />
        </motion.div>
      </div>
    </motion.div>
  );
}
