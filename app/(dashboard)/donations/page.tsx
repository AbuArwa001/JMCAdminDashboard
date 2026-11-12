"use client";

import { useState, useEffect } from "react";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import { Download, Filter, Search, Crown } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { useRBAC } from "@/hooks/useRBAC";

import { toast } from "sonner";
import { getTransactions, getCategories, getDonationDrives } from "@/lib/api_data";
import { Donation, Transaction, CategoryData } from "@/lib/data";
import { useSearchParams } from "next/navigation";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const searchParams = useSearchParams();
  const { isSuperAdmin } = useRBAC();

  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  const filteredDonations = donations.filter((donation) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      donation.user_name?.toLowerCase().includes(term) ||
      donation.account_name?.toLowerCase().includes(term) ||
      donation.amount.toString().includes(searchTerm) ||
      donation.payment_method?.toLowerCase().includes(term) ||
      donation.category?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || donation.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportData = filteredDonations.map((item) => ({
    "Full Name": item.user_name || item.account_name || "Anonymous Donor",
    donation_title: item.donation?.title || "Donation Drive",
    amount: item.amount,
    donated_at: item.donated_at,
    payment_method: item.payment_method,
    payment_status: item.payment_status,
    category: item.category,
  }));

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const [transactions, categoriesData, drivesData] = await Promise.all([
          getTransactions().catch(() => []),
          getCategories().catch(() => []),
          getDonationDrives().catch(() => []),
        ]);

        const categoryMap = (categoriesData || []).reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.category_name;
          return acc;
        }, {});

        const driveMap = (drivesData || []).reduce((acc: any, drive: any) => {
          acc[drive.id] = drive;
          return acc;
        }, {});

        const mappedDonations = (transactions || []).map(
          (t: any): Transaction => {
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

            // Resolve donor name: prefer API-provided user_name, then user.full_name,
            // then account_name — but only if it doesn't match the donation title
            const driveTitle = drive?.title || null;
            const rawApiName = t.user_name || t.user?.full_name;
            let donorName: string;
            if (rawApiName && rawApiName.trim().toLowerCase() !== "anonymous") {
              donorName = rawApiName.trim();
            } else if (
              t.account_name &&
              t.account_name !== driveTitle &&
              t.account_name.toLowerCase() !== "donation"
            ) {
              donorName = t.account_name.trim();
            } else {
              donorName = "Anonymous Donor";
            }

            return {
              ...t,
              donation: drive || t.donation,
              category: categoryName,
              user_name: donorName,
              account_name: t.account_name,
            };
          },
        );

        setDonations(mappedDonations);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load donations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const handleExport = () => {
    exportToCSV(exportData, "donations_report");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-secondary-dark tracking-tight">
              Donations
            </h1>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/30 shadow-sm">
                <Crown className="w-3.5 h-3.5" /> Super Admin Access
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">
            Track, manage, and audit all incoming contributions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-100/50">
          <div className="relative flex-grow md:flex-grow-0 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 transition-all"
            />
          </div>

          <div className="relative group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-gray-100 transition-all font-medium text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary pointer-events-none" />
          </div>

          <div className="h-full w-px bg-gray-200 mx-1 hidden md:block" />

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 font-medium rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <RecentDonationsTable
        transactions={filteredDonations}
        isLoading={isLoading}
        itemsPerPage={5}
        title="Donations Ledger"
        subtitle="Complete history of community donations"
        hideLedgerLink={true}
        onTransactionDeleted={(deletedId) => {
          setDonations((prev) => prev.filter((d) => d.id !== deletedId));
        }}
        onTransactionsBulkDeleted={(deletedIds) => {
          setDonations((prev) => prev.filter((d) => !deletedIds.includes(d.id)));
        }}
        onTransactionUpdated={(updatedTx) => {
          setDonations((prev) =>
            prev.map((d) => (d.id === updatedTx.id ? { ...d, ...updatedTx } : d)),
          );
        }}
      />
    </div>
  );
}
