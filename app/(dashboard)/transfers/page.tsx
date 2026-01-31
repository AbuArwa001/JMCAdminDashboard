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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from "xlsx";

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !confirm(
        `Are you sure you want to transfer KES ${formData.amount} to the selected account?`,
      )
    )
      return;

    setIsSubmitting(true);
    try {
      await initiateTransfer(
        Number(formData.amount),
        formData.destination_account,
        formData.description,
      );
      alert("Transfer initiated successfully!");
      setFormData({ ...formData, amount: "" });
      fetchData(); // Refresh history
    } catch (error: any) {
      // Error handling matches api_data throw
      alert(
        "Transfer failed: " + (error.response?.data?.error || error.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-700 bg-green-50 border-green-100";
      case "Pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-100";
      case "Failed":
        return "text-red-700 bg-red-50 border-red-100";
      default:
        return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-dark tracking-tight">
          Fund Transfers
        </h1>
        <p className="text-gray-500 mt-1">
          Move funds securely from JMC Donation Account to approved
          beneficiaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transfer Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-secondary/20 overflow-hidden relative">
            {/* Decorative Header */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-bronze" />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Initiate Transfer
                  </h2>
                  <p className="text-sm text-gray-500">
                    Safe & Secure B2B Payment
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Source Account (Fixed) */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center gap-4 opacity-75 grayscale-[0.5]">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Wallet className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Source Account
                    </p>
                    <p className="font-bold text-gray-900 text-lg">
                      JMC Paybill
                    </p>
                    <p className="text-sm text-gray-500 font-mono">150770</p>
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className="flex justify-center -my-4 relative z-10">
                  <div className="bg-white p-2 rounded-full shadow border border-gray-100 text-primary">
                    <ArrowRight className="w-5 h-5 transform rotate-90" />
                  </div>
                </div>

                {/* Destination & Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Beneficiary
                    </label>
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
                        className="w-full pl-5 pr-10 py-4 bg-white border border-gray-200 rounded-xl text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all shadow-sm"
                      >
                        <option value="">Choose an account...</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.account_name} — {acc.bank_name} (
                            {acc.account_number})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ArrowRightLeft className="w-5 h-5 opacity-50" />
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => router.push("/accounts/create")}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        + Add New Beneficiary
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
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
                        className="w-full pl-16 pr-5 py-4 bg-white border border-gray-200 rounded-xl text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description / Remarks
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !formData.destination_account ||
                      !formData.amount
                    }
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-bronze text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                  >
                    {isSubmitting
                      ? "Processing Transaction..."
                      : "Confirm Transfer"}
                    {!isSubmitting && <ArrowRight className="w-6 h-6" />}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Secure 256-bit encrypted
                    transaction
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Side Panel / Summary / Stats could go here later */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary-bronze/5 rounded-3xl p-6 border border-primary/10">
            <h3 className="text-primary-bronze font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Recent Activity
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                history.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex gap-3 items-start pb-4 border-b border-primary/5 last:border-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-full mt-0.5 shrink-0 ${tx.status === "Completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {tx.status === "Completed" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {tx.destination_account_details?.account_name}
                      </p>
                      <p className="text-xs text-secondary-dark/60 font-mono">
                        KES {Number(tx.amount).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {format(new Date(tx.created_at), "MMM dd, HH:mm")}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {history.length === 0 && !isLoading && (
                <p className="text-sm text-gray-500 italic">
                  No recent transfers.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full History Table */}
      <div className="bg-white rounded-3xl border border-secondary/20 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Transaction History
            </h3>
            <p className="text-sm text-gray-500">
              Full log of all B2B transfers
            </p>
          </div>
          <button className="px-5 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm border border-gray-200">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-8 py-5 text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 first:pl-8">
                  Date
                </th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  Beneficiary
                </th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  Amount
                </th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  Reference
                </th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-center text-gray-500"
                  >
                    Loading history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-12 text-center text-gray-400 italic"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                history.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6 text-gray-600 text-sm whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {format(new Date(tx.created_at), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(tx.created_at), "HH:mm aaa")}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          {tx.destination_account_details?.paybill_number ? (
                            <CreditCard className="w-4 h-4" />
                          ) : (
                            <Building className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {tx.destination_account_details?.account_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.destination_account_details?.bank_name} •{" "}
                            {tx.destination_account_details?.account_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-mono font-bold text-gray-900 text-lg">
                        KES {Number(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 font-mono text-xs border border-gray-200">
                        {tx.transaction_reference || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(tx.status)}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-current`}
                        />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
