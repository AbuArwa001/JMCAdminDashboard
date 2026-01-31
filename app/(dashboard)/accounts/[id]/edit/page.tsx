"use client";

import AccountForm from "@/components/dashboard/AccountForm";
import { getBankAccountById } from "@/lib/api_data";
import { BankAccount } from "@/lib/data";
import { ArrowLeft, Loader2 } from "lucide-react";
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col h-64 items-center justify-center text-gray-500">
        <p>Account not found</p>
        <Link href="/accounts" className="text-primary hover:underline mt-2">
          Go back to accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/accounts"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Account</h1>
          <p className="text-gray-500 text-sm">Update account details</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <AccountForm initialData={account} isEdit={true} />
      </div>
    </div>
  );
}
