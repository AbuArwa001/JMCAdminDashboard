"use client";

import AccountForm from "@/components/dashboard/AccountForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateAccountPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Account</h1>
          <p className="text-gray-500 text-sm">
            Add a bank account or paybill for transfers
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <AccountForm />
      </div>
    </div>
  );
}
