"use client";

import { BankAccount } from "@/lib/data";
import { getBankAccounts, deleteBankAccount } from "@/lib/api_data";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowRightLeft,
  Building,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getBankAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this beneficiary account?")) {
      try {
        await deleteBankAccount(id);
        toast.success("Account deleted successfully.");
        fetchAccounts();
      } catch (error) {
        toast.error("Failed to delete account.");
      }
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Donors &amp; Accounts
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Manage beneficiary bank accounts, MPESA paybills, and payment channels.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006838] transition-colors" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 py-2.5 bg-white text-sm"
            />
          </div>

          <Link href="/accounts/create" className="btn-primary flex-shrink-0">
            <Plus className="w-4 h-4" />
            Add Account
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-64 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl" />
                <div className="w-3/4 h-5 bg-gray-200 rounded" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
              </div>
              <div className="w-full h-10 bg-gray-100 rounded-xl" />
            </div>
          ))
        ) : filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => {
            const isPaybill = !!account.paybill_number;
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-full"
              >
                {/* Decorative top line */}
                <div
                  className={`h-1.5 w-full ${
                    isPaybill
                      ? "bg-gradient-to-r from-[#c99335] to-amber-400"
                      : "bg-gradient-to-r from-[#006838] to-emerald-400"
                  }`}
                />

                <div className="p-6 relative z-10 space-y-4">
                  {/* Top Bar */}
                  <div className="flex justify-between items-start">
                    <div
                      className={`p-3 rounded-xl border ${
                        isPaybill
                          ? "bg-amber-50 text-[#c99335] border-amber-200/60"
                          : "bg-emerald-50 text-[#006838] border-emerald-200/60"
                      }`}
                    >
                      {isPaybill ? (
                        <CreditCard className="w-5 h-5" />
                      ) : (
                        <Building className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {account.is_active !== false ? (
                        <span className="badge-emerald flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="badge-rose flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}

                      {/* Hover Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-1">
                        <Link
                          href={`/accounts/${account.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-[#006838] hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      {isPaybill ? "M-Pesa Paybill Channel" : "Bank Account Channel"}
                    </span>
                    <h3
                      className="text-lg font-bold text-[#1a1512] leading-tight line-clamp-1 mt-0.5"
                      style={{ fontFamily: "var(--font-cinzel), serif" }}
                      title={account.account_name}
                    >
                      {account.account_name}
                    </h3>
                    <p className="text-xs font-semibold text-[#c99335] mt-1">
                      {account.bank_name}
                    </p>
                  </div>

                  {/* Account / Paybill Number */}
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 font-medium">
                        {isPaybill ? "Paybill Number" : "Account Number"}
                      </span>
                      <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {isPaybill ? account.paybill_number : account.account_number}
                      </span>
                    </div>
                    {isPaybill && account.account_number && (
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-100">
                        <span className="text-gray-400 font-medium">Account Reference</span>
                        <span className="font-mono text-gray-700">{account.account_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-gray-50/70 border-t border-gray-100 relative z-10">
                  <Link
                    href={`/transfers?to=${account.id}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-[#006838] hover:text-white hover:border-[#006838] transition-all duration-200 font-semibold text-xs shadow-sm hover:shadow-md"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    Initiate Transfer
                  </Link>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 text-[#c99335]">
              <Wallet className="w-7 h-7" />
            </div>
            <h3
              className="text-xl font-bold text-[#1a1512]"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              No Beneficiary Accounts Found
            </h3>
            <p className="text-gray-500 max-w-sm mt-1 mb-6 text-sm leading-relaxed">
              No beneficiary accounts registered yet. Add a bank account or MPESA paybill to begin internal transfers.
            </p>
            <Link href="/accounts/create" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add First Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
