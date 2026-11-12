"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Crown } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { useRBAC } from "@/hooks/useRBAC";
import { useDonationsPage } from "@/hooks/use-donations-page";
import { DonationsToolbar } from "@/components/donations/DonationsToolbar";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";

export default function DonationsPage() {
  const { donations, setDonations, isLoading } = useDonationsPage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const searchParams = useSearchParams();
  const { isSuperAdmin } = useRBAC();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const filtered = donations.filter((d) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = d.user_name?.toLowerCase().includes(term) || d.account_name?.toLowerCase().includes(term) || d.amount.toString().includes(searchTerm) || d.category?.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "All" || d.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    exportToCSV(
      filtered.map((item) => ({ "Full Name": item.user_name || item.account_name || "Anonymous", donation_title: item.donation?.title || "Drive", amount: item.amount, donated_at: item.donated_at, payment_method: item.payment_method, payment_status: item.payment_status, category: item.category })),
      "donations_report"
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-secondary-dark tracking-tight">Donations</h1>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/30">
                <Crown className="w-3.5 h-3.5" /> Super Admin Access
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1">Track, manage, and audit all incoming contributions.</p>
        </div>
        <DonationsToolbar searchTerm={searchTerm} statusFilter={statusFilter} onSearchChange={setSearchTerm} onStatusChange={setStatusFilter} onExport={handleExport} />
      </div>

      <RecentDonationsTable
        transactions={filtered}
        isLoading={isLoading}
        itemsPerPage={5}
        title="Donations Ledger"
        subtitle="Complete history of community donations"
        hideLedgerLink={true}
        onTransactionDeleted={(id) => setDonations((p) => p.filter((d) => d.id !== id))}
        onTransactionsBulkDeleted={(ids) => setDonations((p) => p.filter((d) => !ids.includes(d.id)))}
        onTransactionUpdated={(up) => setDonations((p) => p.map((d) => (d.id === up.id ? { ...d, ...up } : d)))}
      />
    </div>
  );
}
