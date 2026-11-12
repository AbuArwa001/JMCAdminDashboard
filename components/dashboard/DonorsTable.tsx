"use client";

import { Donation } from "@/lib/data";
import { clsx } from "clsx";
import {
  Download,
  CheckCircle,
  Trash2,
  SlidersHorizontal,
  AlertTriangle,
  Loader2,
  X,
  Crown,
  User as UserIcon,
  Phone,
} from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRBAC } from "@/hooks/useRBAC";
import { updateTransaction, deleteTransaction } from "@/lib/api_data";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface DonorsTableProps {
  donations: Donation[];
  driveTitle: string;
  onDonationDeleted?: (id: string) => void;
  onDonationUpdated?: (updated: Donation) => void;
}

export default function DonorsTable({
  donations: initialDonations,
  driveTitle,
  onDonationDeleted,
  onDonationUpdated,
}: DonorsTableProps) {
  const [donations, setDonations] = useState<Donation[]>([...initialDonations]);
  const { isSuperAdmin, hasPermission } = useRBAC();
  const canDelete = isSuperAdmin || hasPermission("donations.delete");
  const canManage = isSuperAdmin || hasPermission("donations.manage");

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Manage Modal State
  const [manageDonation, setManageDonation] = useState<Donation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    amount: 0,
    payment_status: "Pending",
    payment_method: "M-Pesa",
  });

  // Delete Modal State
  const [deleteDonation, setDeleteDonation] = useState<Donation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setDonations([...initialDonations]);
  }, [initialDonations]);

  const filteredDonations = donations.map((item) => ({
    "Full Name": item.donorName || "Anonymous",
    donation_title: driveTitle,
    amount: item.amount,
    donated_at: item.date,
    payment_method: item.paymentMethod,
    payment_status: item.status,
  }));

  const handleExport = () => {
    exportToCSV(
      filteredDonations,
      `${driveTitle.replace(/\s+/g, "_").toLowerCase()}_donors`,
    );
  };

  const handleCompletePayment = async (id: string) => {
    setProcessingId(id);
    try {
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "Completed" } : d)),
      );

      await updateTransaction(id, { payment_status: "Completed" });

      const updated = donations.find((d) => d.id === id);
      if (updated) {
        onDonationUpdated?.({ ...updated, status: "Completed" });
      }

      toast.success("Payment marked as Completed");
    } catch (error) {
      console.error(error);
      setDonations((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "Pending" } : d)),
      );
      toast.error("Failed to update payment status");
    } finally {
      setProcessingId(null);
    }
  };

  const openManageModal = (donation: Donation) => {
    setManageDonation(donation);
    setFormData({
      account_name: donation.donorName || "",
      account_number: "",
      amount: donation.amount || 0,
      payment_status: donation.status || "Pending",
      payment_method: donation.paymentMethod || "M-Pesa",
    });
  };

  const handleSaveManage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageDonation) return;

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsSaving(true);
    try {
      await updateTransaction(manageDonation.id, {
        account_name: formData.account_name || undefined,
        account_number: formData.account_number || undefined,
        amount: Number(formData.amount),
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
      });

      const updated: Donation = {
        ...manageDonation,
        donorName: formData.account_name || manageDonation.donorName,
        amount: Number(formData.amount),
        status: formData.payment_status as any,
        paymentMethod: formData.payment_method as any,
      };

      setDonations((prev) =>
        prev.map((d) => (d.id === manageDonation.id ? updated : d)),
      );

      onDonationUpdated?.(updated);
      toast.success("Transaction updated successfully");
      setManageDonation(null);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.detail || "Failed to update transaction");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteDonation) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteDonation.id);
      setDonations((prev) => prev.filter((d) => d.id !== deleteDonation.id));
      onDonationDeleted?.(deleteDonation.id);
      toast.success("Transaction permanently deleted");
      setDeleteDonation(null);
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error?.response?.data?.detail || "Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
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
          <p className="text-xs text-gray-400 mt-0.5">
            Contributions recorded under this campaign
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Donors
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
            {donations.map((donation) => (
              <tr
                key={donation.id}
                className="hover:bg-amber-500/5 transition-colors group"
              >
                <td className="py-3.5 pl-2 text-sm font-bold text-gray-900">
                  {donation.donorName}
                </td>
                <td className="py-3.5 text-sm font-extrabold text-gray-900">
                  KES {donation.amount.toLocaleString()}
                </td>
                <td className="py-3.5 text-xs font-semibold text-gray-600">
                  {donation.paymentMethod}
                </td>
                <td className="py-3.5 text-xs text-gray-400 font-mono">
                  {new Date(donation.date).toLocaleDateString()}
                </td>
                <td className="py-3.5">
                  <span
                    className={clsx(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm inline-flex items-center gap-1",
                      donation.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30",
                    )}
                  >
                    <span
                      className={clsx(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        donation.status === "Completed"
                          ? "bg-emerald-500"
                          : "bg-amber-500",
                      )}
                    ></span>
                    {donation.status}
                  </span>
                </td>
                <td className="py-3.5 pr-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {canManage && donation.status === "Pending" && (
                      <button
                        onClick={() => handleCompletePayment(donation.id)}
                        disabled={processingId === donation.id}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Mark as Completed"
                      >
                        {processingId === donation.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        )}
                      </button>
                    )}

                    {canManage && (
                      <button
                        onClick={() => openManageModal(donation)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                        title="Manage Transaction"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => setDeleteDonation(donation)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Transaction (Super Admin)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 text-sm font-medium"
                >
                  No donors recorded for this drive yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== Manage Modal ==================== */}
      <AnimatePresence>
        {manageDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Manage Transaction
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      ID: {manageDonation.id.slice(0, 16)}...
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setManageDonation(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveManage} className="space-y-4 py-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Donor Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_name: e.target.value,
                        })
                      }
                      placeholder="Donor Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Amount (KES)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      value={formData.payment_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium"
                  >
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = manageDonation;
                        setManageDonation(null);
                        setDeleteDonation(target);
                      }}
                      className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => setManageDonation(null)}
                      className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 rounded-xl shadow-md disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Delete Confirmation Modal ==================== */}
      <AnimatePresence>
        {deleteDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Delete Transaction
                  </h3>
                  <span className="text-[10px] font-bold text-[#c99335] uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Super Admin Authorization
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Are you sure you want to permanently delete this contribution of{" "}
                <strong className="text-gray-900">
                  KES {deleteDonation.amount.toLocaleString()}
                </strong>{" "}
                from {deleteDonation.donorName}? This cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteDonation(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={isDeleting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
