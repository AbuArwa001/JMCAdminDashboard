"use client";

import { useState, useEffect } from "react";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import { Download, Filter, Search } from "lucide-react";
import { exportToCSV } from "@/lib/utils";

import { toast } from "sonner";
import { getTransactions, getCategories } from "@/lib/api_data";
import { Donation, Transaction, CategoryData } from "@/lib/data";
import { useSearchParams } from "next/navigation";

export default function DonationsPage() {
  const [donations, setDonations] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const searchParams = useSearchParams();

  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [searchParams]);

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.amount.toString().includes(searchTerm) ||
      donation.payment_method
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      donation.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || donation.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportData = filteredDonations.map((item) => ({
    "Full Name": item.user_name,
    donation_title: item.donation?.title,
    amount: item.amount,
    donated_at: item.donated_at,
    payment_method: item.payment_method,
    payment_status: item.payment_status,
    category: item.category,
  }));

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // 1. Fetch Transactions AND Categories in parallel
        // 1. Fetch Transactions AND Categories in parallel
        const [transactions, categoriesData] = await Promise.all([
          getTransactions(),
          getCategories(),
        ]);

        // 2. Create a lookup map: { "id": "Name" }
        const categoryMap = categoriesData.reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.category_name;
          return acc;
        }, {});

        // 3. Map transactions with category names in memory (No more extra API calls!)
        const mappedDonations = transactions.map(
          (t: any): Transaction => ({
            ...t,
            category: categoryMap[t.donation?.category] || "General",
            user_name: t.user?.full_name || "Anonymous",
          }),
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
          <h1 className="text-3xl font-bold text-secondary-dark tracking-tight">
            Donations
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage all incoming contributions.
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
      />
    </div>
  );
}
