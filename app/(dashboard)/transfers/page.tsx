"use client";

import { BankAccount, Transfer } from "@/lib/data";
import {
  getBankAccounts,
  getTransferHistory,
  initiateTransfer,
} from "@/lib/api_data";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRightLeft,
  Search,
  Download,
  Wallet,
  CreditCard,
  Send,
  Building,
  ShieldCheck,
  ChevronDown,
  Lock,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function TransfersPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [history, setHistory] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialToObject = searchParams.get("to") || "";

  const [formData, setFormData] = useState({
    destination_account: initialToObject,
    amount: "",
    description: "Transfer from JMC Donation Account",
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [accountsData, historyData] = await Promise.all([
        getBankAccounts(),
        getTransferHistory(),
      ]);
      setAccounts(accountsData);
      setHistory(historyData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load transfer history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination_account) {
      toast.error("Please select a beneficiary account.");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid transfer amount.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to transfer KES ${Number(formData.amount).toLocaleString()} to the selected beneficiary?`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await initiateTransfer(
        Number(formData.amount),
        formData.destination_account,
        formData.description
      );
      toast.success("Transfer initiated successfully! 🚀");
      setFormData({ ...formData, amount: "" });
      fetchData();
    } catch (error: any) {
      toast.error(
        "Transfer failed: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      toast.error("No transaction data to export.");
      return;
    }
    const dataToExport = history.map((tx) => ({
      ID: tx.id,
      Date: format(new Date(tx.created_at), "yyyy-MM-dd HH:mm:ss"),
      Beneficiary: tx.destination_account_details?.account_name || "N/A",
      Bank: tx.destination_account_details?.bank_name || "N/A",
      AccountNo: tx.destination_account_details?.account_number || "N/A",
      Amount_KES: Number(tx.amount),
      Reference: tx.transaction_reference || "PENDING",
      Status: tx.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transfers");
    XLSX.writeFile(workbook, `JMC_Transfers_${format(new Date(), "yyyyMMdd")}.xlsx`);
    toast.success("Exported transfer history to Excel!");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <ArrowRightLeft className="w-5 h-5 text-[#c99335]" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Internal Fund Transfers
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Secure B2B payout channels from JMC Central Paybill to approved beneficiaries.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-secondary flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          Export History
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transfer Form Card */}
        <div className="lg:col-span-2">
          <div className="form-section">
            {/* Header */}
            <div className="form-section-header">
              <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
                <Send className="w-4 h-4 text-[#c99335]" />
              </div>
              <div>
                <h3
                  className="font-bold text-sm tracking-wide"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  Initiate Transfer
                </h3>
                <p className="text-[11px] text-gray-400">Safe &amp; Encrypted B2B Channel</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="form-section-body space-y-6">
              {/* Source Account Card (Fixed) */}
              <div className="p-5 bg-gradient-to-r from-[#1a1512] to-[#2d2520] text-white rounded-2xl border border-[#2d2520] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c99335]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                      <Wallet className="w-5 h-5 text-[#c99335]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Source Account
                      </span>
                      <h4 className="font-bold text-base text-white">JMC Central Paybill</h4>
                      <p className="text-xs text-[#c99335] font-mono mt-0.5">Paybill: 150770</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <Lock className="w-3 h-3 text-emerald-400" /> Verified Channel
                  </div>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center -my-2">
                <div className="w-8 h-8 rounded-full bg-[#1a1512] text-[#c99335] border border-[#2d2520] flex items-center justify-center shadow-md">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>

              {/* Destination Account Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label mb-0">
                    Select Beneficiary Account <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push("/accounts/create")}
                    className="text-xs font-bold text-[#c99335] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Beneficiary
                  </button>
                </div>
                <div className="relative">
                  <select
                    required
                    value={formData.destination_account}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination_account: e.target.value,
                      })
                    }
                    className="form-input appearance-none pr-10 cursor-pointer text-sm"
                  >
                    <option value="">Choose an account...</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_name} — {acc.bank_name} (
                        {acc.paybill_number ? `Paybill: ${acc.paybill_number}` : `Acc: ${acc.account_number}`})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="form-label">
                  Transfer Amount (KES) <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    KES
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="form-input pl-14 text-lg font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description / Remarks</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="Reason for transfer..."
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.destination_account ||
                    !formData.amount
                  }
                  className="w-full btn-primary justify-center py-3.5 text-base shadow-lg shadow-[#006838]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Transaction...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Confirm &amp; Dispatch Funds
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Protected by 256-bit encrypted Daraja B2B gateway
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Side Panel: Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="form-section">
            <div className="form-section-header">
              <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#c99335]" />
              </div>
              <div>
                <h3
                  className="font-bold text-sm tracking-wide"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  Recent Activity
                </h3>
                <p className="text-[11px] text-gray-400">Latest dispatched transfers</p>
              </div>
            </div>

            <div className="p-5 bg-white divide-y divide-gray-100">
              {isLoading ? (
                <div className="py-8 text-center text-xs text-gray-400 font-medium">Loading history...</div>
              ) : history.length > 0 ? (
                history.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">
                        {tx.destination_account_details?.account_name || "Beneficiary"}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        KES {Number(tx.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {format(new Date(tx.created_at), "MMM dd, HH:mm")}
                      </p>
                    </div>
                    <div>
                      {tx.status === "Completed" ? (
                        <span className="badge-emerald text-[10px]">Completed</span>
                      ) : tx.status === "Pending" ? (
                        <span className="badge-gold text-[10px]">Pending</span>
                      ) : (
                        <span className="badge-rose text-[10px]">Failed</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">No recent transfers.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Transaction History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3
            className="font-bold text-gray-900 text-base flex items-center gap-2"
            style={{ fontFamily: "var(--font-cinzel), serif" }}
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            Transaction History Log
          </h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {history.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 font-medium">Loading history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <th className="px-6 py-4 border-b border-gray-100">Date &amp; Time</th>
                  <th className="px-6 py-4 border-b border-gray-100">Beneficiary</th>
                  <th className="px-6 py-4 border-b border-gray-100">Amount</th>
                  <th className="px-6 py-4 border-b border-gray-100">Reference</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-semibold text-gray-900">
                        {format(new Date(tx.created_at), "MMM dd, yyyy")}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {format(new Date(tx.created_at), "HH:mm aaa")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500 flex-shrink-0">
                          {tx.destination_account_details?.paybill_number ? (
                            <CreditCard className="w-4 h-4 text-[#c99335]" />
                          ) : (
                            <Building className="w-4 h-4 text-[#006838]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {tx.destination_account_details?.account_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.destination_account_details?.bank_name} &bull;{" "}
                            <span className="font-mono">{tx.destination_account_details?.account_number}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#1a1512] text-sm">
                        KES {Number(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-mono text-xs border border-gray-200">
                        {tx.transaction_reference || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {tx.status === "Completed" ? (
                        <span className="badge-emerald">Completed</span>
                      ) : tx.status === "Pending" ? (
                        <span className="badge-gold">Pending</span>
                      ) : (
                        <span className="badge-rose">Failed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                      No transfer records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
