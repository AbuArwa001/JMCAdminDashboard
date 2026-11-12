"use client";

import { BankAccount } from "@/lib/data";
import { getBankAccounts, deleteBankAccount } from "@/lib/api_data";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AccountsHeader } from "@/components/accounts/AccountsHeader";
import { BankAccountCard } from "@/components/accounts/BankAccountCard";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setAccounts(await getBankAccounts());
    } catch {
      toast.error("Failed to load accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this beneficiary account?")) {
      try {
        await deleteBankAccount(id);
        toast.success("Account deleted successfully.");
        fetchAccounts();
      } catch {
        toast.error("Failed to delete account.");
      }
    }
  };

  const filtered = accounts.filter(
    (a) => a.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || a.bank_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <AccountsHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 flex flex-col justify-between">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-3/4 h-5 rounded" />
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((acc) => <BankAccountCard key={acc.id} account={acc} onDelete={handleDelete} />)
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 text-sm">No accounts found.</div>
        )}
      </div>
    </div>
  );
}
