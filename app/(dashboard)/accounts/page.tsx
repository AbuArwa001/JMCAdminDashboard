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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getBankAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteBankAccount(id);
        fetchAccounts();
      } catch (error) {
        alert("Failed to delete account");
      }
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
        <div>
          <h1 className="text-3xl font-bold text-secondary-dark tracking-tight">
            Accounts & Paybills
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your external beneficiaries and payment channels.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium placeholder:text-gray-400"
            />
          </div>

          <Link
            href="/accounts/create"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-bronze text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 font-medium"
          >
            <Plus className="w-5 h-5" />
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
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-64"
            ></div>
          ))
        ) : filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-2xl border border-secondary/20 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-full"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110 blur-2xl" />

              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-xl ${account.paybill_number ? "bg-primary/10 text-primary" : "bg-blue-50 text-blue-600"}`}
                  >
                    {account.paybill_number ? (
                      <CreditCard className="w-6 h-6" />
                    ) : (
                      <Building className="w-6 h-6" />
                    )}
                  </div>

                  {/* Actions (Hidden until hover) */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/accounts/${account.id}/edit`}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">
                    {account.paybill_number ? "Paybill / Till" : "Bank Account"}
                  </p>
                  <h3
                    className="text-xl font-bold text-secondary-dark leading-tight line-clamp-2"
                    title={account.account_name}
                  >
                    {account.account_name}
                  </h3>
                  <p className="text-sm font-medium text-primary mt-1">
                    {account.bank_name}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 py-4 border-t border-gray-50">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 mb-0.5">
                      Account Number
                    </p>
                    <p className="font-mono text-secondary-dark font-medium tracking-wide">
                      {account.account_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-4 bg-gray-50/50 border-t border-gray-100 relative z-10">
                <Link
                  href={`/transfers?to=${account.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Quick Transfer
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <div className="p-4 bg-secondary rounded-full mb-6 relative">
              <Wallet className="w-10 h-10 text-primary-bronze" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Plus className="w-3 h-3 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-secondary-dark">
              No accounts found
            </h3>
            <p className="text-gray-500 max-w-sm mt-2 mb-8 mx-auto leading-relaxed">
              You haven't added any beneficiary accounts yet. Add one to start
              making transfers.
            </p>
            <Link
              href="/accounts/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-bronze transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Add First Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
