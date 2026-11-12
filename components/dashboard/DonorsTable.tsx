"use client";

import { Donation } from "@/lib/data";
import { Download, Crown } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { useRBAC } from "@/hooks/useRBAC";
import { useDonorsTable } from "@/hooks/use-donors-table";
import { DonorsTableRow } from "./DonorsTableRow";
import { DonorsTableEditModal } from "./DonorsTableEditModal";
import { DonorsTableDeleteModal } from "./DonorsTableDeleteModal";

interface DonorsTableProps {
  donations: Donation[];
  driveTitle: string;
  onDonationDeleted?: (id: string) => void;
  onDonationUpdated?: (updated: Donation) => void;
}

export default function DonorsTable({ donations: initialDonations, driveTitle, onDonationDeleted, onDonationUpdated }: DonorsTableProps) {
  const { isSuperAdmin, hasPermission } = useRBAC();
  const canDelete = isSuperAdmin || hasPermission("donations.delete");
  const canManage = isSuperAdmin || hasPermission("donations.manage");

  const {
    donations, processingId, manageDonation, deleteDonation, isSaving, isDeleting, formData,
    setFormData, setManageDonation, setDeleteDonation, handleComplete, handleSave, handleDelete, openManage,
  } = useDonorsTable(initialDonations, onDonationUpdated, onDonationDeleted);

  const handleExport = () => {
    exportToCSV(
      donations.map((item) => ({ "Full Name": item.donorName || "Anonymous", donation_title: driveTitle, amount: item.amount, donated_at: item.date, payment_method: item.paymentMethod, payment_status: item.status })),
      `${driveTitle.replace(/\s+/g, "_").toLowerCase()}_donors`
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            Donors Ledger
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/30">
                <Crown className="w-3 h-3" /> Super Admin
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Contributions recorded under this campaign</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export Donors
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 pl-2">Donor</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Payment Method</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {donations.map((d) => (
              <DonorsTableRow key={d.id} donation={d} canManage={canManage} canDelete={canDelete} processingId={processingId} onComplete={handleComplete} onEdit={openManage} onDelete={setDeleteDonation} />
            ))}
          </tbody>
        </table>
      </div>

      <DonorsTableEditModal donation={manageDonation} formData={formData} isSaving={isSaving} onChange={setFormData} onClose={() => setManageDonation(null)} onSubmit={handleSave} />
      <DonorsTableDeleteModal donation={deleteDonation} isDeleting={isDeleting} onClose={() => setDeleteDonation(null)} onConfirm={handleDelete} />
    </div>
  );
}
