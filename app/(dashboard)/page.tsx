"use client";

import {
  getCategories,
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
import {
  DollarSign,
  TrendingUp,
  HeartHandshake,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  UserCheck,
  KeyRound,
  BookOpen,
  Mic,
  Newspaper,
  CalendarDays,
  HandHeart,
  BookMarked,
  Clock,
  Calculator,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CategoryData, DonationDrive, DonationTrend } from "@/lib/data";
import Link from "next/link";
import { useRBAC } from "@/hooks/useRBAC";

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
  const { staffUser, isSuperAdmin, hasPermission, hasAnyPermission, isLoading: rbacLoading } =
    useRBAC();

  const canViewDashboard = isSuperAdmin || hasPermission("dashboard.view");

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
    if (!canViewDashboard) {
      setIsLoading(false);
      return;
    }

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
  }, [canViewDashboard]);

  // Loading state
  if (rbacLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#c99335] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Loading Executive View...
          </p>
        </div>
      </div>
    );
  }

  // ==================== Non-Finance / Content Manager Tailored View ====================
  if (!canViewDashboard) {
    const roleName = staffUser?.role?.role_name || "Content Manager";
    const communityModules = [
      {
        title: "Friday Khutba",
        desc: "Publish sermon summaries, audio recordings and notify congregation",
        href: "/community/khutba",
        icon: Mic,
        color: "text-amber-500",
        bg: "bg-amber-50",
        perm: "khutba.manage",
      },
      {
        title: "Friday Bulletins",
        desc: "Upload weekly PDF bulletins and broadcast updates to subscribers",
        href: "/community/bulletins",
        icon: Newspaper,
        color: "text-blue-500",
        bg: "bg-blue-50",
        perm: "bulletins.manage",
      },
      {
        title: "Darsas & Classes",
        desc: "Schedule madrasa, tafsir, hadith classes and weekly study circles",
        href: "/community/darsas",
        icon: BookOpen,
        color: "text-teal-500",
        bg: "bg-teal-50",
        perm: "darsas.manage",
      },
      {
        title: "Community Events",
        desc: "Manage mosque programs, guest lectures, youth and family events",
        href: "/community/events",
        icon: CalendarDays,
        color: "text-sky-500",
        bg: "bg-sky-50",
        perm: "events.manage",
      },
      {
        title: "Duas & Supplications",
        desc: "Curate authentic daily adhkar, morning/evening and special supplications",
        href: "/community/duas",
        icon: HandHeart,
        color: "text-rose-500",
        bg: "bg-rose-50",
        perm: "duas.manage",
      },
      {
        title: "Noble Quran",
        desc: "Audio recitations, verified surah translations and reciter catalog",
        href: "/community/quran",
        icon: BookMarked,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        perm: "quran.manage",
      },
      {
        title: "Prayer Timings",
        desc: "Maintain seasonal prayer timetables, overrides and city calculation rules",
        href: "/community/prayer-times",
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        perm: "prayer_times.manage",
      },
      {
        title: "Zakat Calculator",
        desc: "Maintain live Nisab thresholds for gold and silver in local currency",
        href: "/community/zakat",
        icon: Calculator,
        color: "text-green-600",
        bg: "bg-green-50",
        perm: "zakat.manage",
      },
    ].filter((m) => hasPermission(m.perm));

    return (
      <div className="space-y-8 pb-12">
        {/* Welcome Header */}
        <div className="p-8 bg-gradient-to-r from-[#1a1512] via-[#241c17] to-[#120e0c] rounded-3xl text-white shadow-xl relative overflow-hidden border border-[#c99335]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c99335]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#c99335] text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{roleName} Workspace</span>
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Welcome back, {staffUser?.full_name || "Officer"}
            </h1>
            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              You are signed in with community publishing and operational clearance. Select a module
              below to publish content, manage notifications, or update congregation resources.
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#c99335]" />
                Your Accessible Modules
              </h2>
              <p className="text-xs text-gray-400">
                Authorized for your role according to active RBAC policy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {communityModules.map((mod) => {
              const IconComp = mod.icon;
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#c99335]/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${mod.bg} ${mod.color}`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#c99335] transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#c99335]">
                    <span>Open Module</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==================== Full Executive / Finance Dashboard ====================
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Super Admin Quick Command Strip */}
      {isSuperAdmin && (
        <motion.div
          variants={item}
          className="p-4 px-6 bg-gradient-to-r from-[#1a1512] via-[#241c17] to-[#120e0c] rounded-2xl text-white shadow-lg border border-[#c99335]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c99335]/20 text-[#c99335] border border-[#c99335]/30 flex-shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Super Administrator Mode Active
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-[11px] text-gray-300 font-medium">
                Full root clearance enabled • Role-Based Access Control operational
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/users"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#c99335]" />
              Manage Staff
            </Link>
            <Link
              href="/roles"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c99335] hover:bg-[#e39e3b] text-xs font-bold text-[#1a1512] transition-all shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Roles Matrix
            </Link>
          </div>
        </motion.div>
      )}

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
