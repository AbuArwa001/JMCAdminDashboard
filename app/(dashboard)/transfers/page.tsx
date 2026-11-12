"use client";

import { useSearchParams } from "next/navigation";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useTransfersData } from "@/hooks/use-transfers-data";
import { TransferInitiateForm } from "@/components/transfers/TransferInitiateForm";
import { TransferHistoryTable } from "@/components/transfers/TransferHistoryTable";

export default function TransfersPage() {
  const searchParams = useSearchParams();
  const initialTo = searchParams.get("to") || "";
  const { accounts, history, isLoading, isSubmitting, formData, setFormData, handleSend } = useTransfersData(initialTo);

  return (
    <PermissionGuard permission="transfers.view">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Internal Treasury Transfers</h1>
          <p className="text-xs text-gray-500 mt-1">Disburse Paybill funds to official Jamia Mosque bank accounts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TransferInitiateForm accounts={accounts} formData={formData} isSubmitting={isSubmitting} onChange={setFormData} onSubmit={handleSend} />
          <TransferHistoryTable history={history} isLoading={isLoading} />
        </div>
      </div>
    </PermissionGuard>
  );
}
