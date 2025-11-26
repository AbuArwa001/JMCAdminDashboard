"use client";

import { Wallet, Heart, Users, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import DonationChart from "@/components/dashboard/DonationChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import RatingAnalysis from "@/components/dashboard/RatingAnalysis";
import { ACTIVE_DRIVES, STATS } from "@/lib/data";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Collected Today"
          value={`KES ${STATS.today.toLocaleString()}`}
          icon={Wallet}
          trend="+12%"
          trendUp={true}
          color="primary"
        />
        <StatCard
          title="This Week"
          value={`KES ${STATS.thisWeek.toLocaleString()}`}
          icon={TrendingUp}
          trend="+5%"
          trendUp={true}
          color="green"
        />
        <StatCard
          title="This Month"
          value={`KES ${STATS.thisMonth.toLocaleString()}`}
          icon={Heart}
          trend="+8%"
          trendUp={true}
          color="bronze"
        />
        <StatCard
          title="Active Drives"
          value={ACTIVE_DRIVES.length}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DonationChart />
        </div>
        <div>
          <CategoryPieChart />
        </div>
      </div>

      {/* Ratings & Active Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RatingAnalysis />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-gray-900">Active Donation Drives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACTIVE_DRIVES.map((drive) => (
              <DriveProgressCard key={drive.id} drive={drive} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <RecentDonationsTable />
    </div>
  );
}
