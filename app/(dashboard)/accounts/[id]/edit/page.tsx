"use client";

import AccountForm from "@/components/dashboard/AccountForm";
import { getBankAccountById } from "@/lib/api_data";
import { BankAccount } from "@/lib/data";
import { ArrowLeft, Loader2, Edit3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EditAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getBankAccountById(params.id);
        setAccount(data);
      } catch (error) {
        console.error("Error fetching account:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccount();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-[#006838]" />
          Loading account details...
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col h-64 items-center justify-center text-gray-500 text-center space-y-3">
        <p className="text-base font-bold text-gray-900">Account not found</p>
        <Link href="/accounts" className="btn-secondary text-xs">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/accounts"
          className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 border border-gray-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <Edit3 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Edit Account
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Update details for {account.account_name}
            </p>
          </div>
        </div>
      </div>

      <AccountForm initialData={account} isEdit={true} />
    </div>
  );
}
