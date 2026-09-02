"use client";

import AccountForm from "@/components/dashboard/AccountForm";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

export default function CreateAccountPage() {
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
            <Building2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Add Beneficiary Account
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Register a bank account or MPESA paybill for internal transfers.
            </p>
          </div>
        </div>
      </div>

      <AccountForm />
    </div>
  );
}
