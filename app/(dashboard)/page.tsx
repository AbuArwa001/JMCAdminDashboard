"use client";

import { getCategoryById, getDonationDrives, getTransactions } from "@/lib/api_data";
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
import { DonationDrive } from "@/lib/data";

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
        /* 
        {
        "id": "55555555-5555-5555-5555-555555550004",
        "user": {
            "id": "22222222-2222-2222-2222-222222220005",
            "public_uuid": "22222222-2222-2222-2222-222222220005",
            "email": "donor4@example.com",
            "username": "donor4",
            "full_name": "Bob Brown",
            "phone_number": null,
            "is_admin": false,
            "role": "11111111-1111-1111-1111-111111110002",
            "fcm_token": null,
            "profile_image_url": null,
            "address": null,
            "bio": null,
            "default_donation_account": null
        },
        "donation": {
            "id": "44444444-4444-4444-4444-444444440002",
            "title": "Health Camp Support",
            "description": "Support our free health camps in rural areas.",
            "created_at": "2024-01-05T08:00:00",
            "account_name": "HealthCamp",
            "target_amount": "10000.00",
            "start_date": "2024-01-05T08:00:00",
            "end_date": "2026-12-31T23:59:59",
            "status": "Active",
            "avg_rating": 4.5,
            "paybill_number": "123457",
            "category": "33333333-3333-3333-3333-333333330002",
            "donor_count": 4,
            "collected_amount": 1475
        },
        "amount": "250.00",
        "donated_at": "2024-05-04T13:00:00",
        "payment_method": "Cash",
        "payment_status": "Pending"
    }
        */
        const getCategoryByIdCached = ((id) => {
          const cache: Record<string, string> = {};
          return async (id: string) => {
            if (cache[id]) {
              return cache[id];
            }
            const category = await getCategoryById(id);
            const categoryName = category ? category.category_name : "General";
            cache[id] = categoryName;
            return categoryName;
          };
        })();
        const transactionsRes = (await getTransactions()).slice(0, 5);
        const mappedTransactions = transactionsRes.map((t: any) => ({
          id: t.id,
          donorName: t.user.full_name ? `${t.user.full_name}` : "Anonymous",
          amount: t.amount,
          category:  getCategoryByIdCached(t.donation.category) || "General",
          paymentMethod: t.payment_method,
          status: t.payment_status,
          date: t.donated_at,
        }));
        console.log("Transactions RES:", transactionsRes);
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
