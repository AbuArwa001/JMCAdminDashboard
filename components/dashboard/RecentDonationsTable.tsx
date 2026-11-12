"use client";

import { updateTransaction, deleteTransaction, bulkDeleteTransactions } from "@/lib/api_data";
import { Transaction } from "@/lib/data";
import { useRBAC } from "@/hooks/useRBAC";
import clsx from "clsx";
import {
  CheckCircle,
  ArrowUpRight,
  CreditCard,
  Wallet,
  Smartphone,
  ShieldCheck,
  Trash2,
  SlidersHorizontal,
  X,
  AlertTriangle,
  Loader2,
  Crown,
  DollarSign,
  User as UserIcon,
  Phone,
  FileText,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onTransactionDeleted?: (id: string) => void;
  onTransactionsBulkDeleted?: (ids: string[]) => void;
  onTransactionUpdated?: (updated: Transaction) => void;
  itemsPerPage?: number;
  title?: string;
  subtitle?: string;
  hideLedgerLink?: boolean;
}

export default function RecentDonationsTable({
  transactions,
  isLoading,
  onTransactionDeleted,
  onTransactionsBulkDeleted,
  onTransactionUpdated,
  itemsPerPage,
  title,
  subtitle,
  hideLedgerLink,
}: RecentTransactionsTableProps) {
  const [localTransactions, setLocalTransactions] =
    useState<Transaction[]>(transactions);

  const { isSuperAdmin, hasPermission } = useRBAC();
  const canDelete = isSuperAdmin || hasPermission("donations.delete");
  const canManage = isSuperAdmin || hasPermission("donations.manage");

  const [processingId, setProcessingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk Selection & Delete State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Manage Modal State
  const [manageTx, setManageTx] = useState<Transaction | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    amount: 0,
    payment_status: "Pending",
    payment_method: "M-Pesa",
    transaction_reference: "",
    mpesa_receipt: "",
  });

  // Delete Modal State
  const [deleteTx, setDeleteTx] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setLocalTransactions(transactions);
    setCurrentPage(1);
    // Prune selected IDs that are no longer in transactions
    setSelectedIds((prev) => {
      const validIds = new Set(transactions.map((t) => t.id));
      const next = new Set<string>();
      prev.forEach((id) => {
        if (validIds.has(id)) next.add(id);
      });
      return next;
    });
  }, [transactions]);

  // Pagination Calculations
  const totalPages = itemsPerPage
    ? Math.max(1, Math.ceil(localTransactions.length / itemsPerPage))
    : 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;
  const paginatedTransactions = itemsPerPage
    ? localTransactions.slice(startIndex, startIndex + itemsPerPage)
    : localTransactions;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // Bulk Selection Helpers (operates on current visible page)
  const isAllSelected =
    paginatedTransactions.length > 0 &&
    paginatedTransactions.every((t) => selectedIds.has(t.id));
  const isIndeterminate =
    paginatedTransactions.some((t) => selectedIds.has(t.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedTransactions.forEach((t) => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedTransactions.forEach((t) => next.add(t.id));
        return next;
      });
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedTransactions = localTransactions.filter((t) =>
    selectedIds.has(t.id),
  );
  const totalSelectedAmount = selectedTransactions.reduce(
    (acc, t) => acc + (t.amount || 0),
    0,
  );

  const handleBulkDeleteSubmit = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleting(true);
    const idsToDelete = Array.from(selectedIds);
    try {
      const res = await bulkDeleteTransactions(idsToDelete);
      setLocalTransactions((prev) =>
        prev.filter((t) => !selectedIds.has(t.id)),
      );
      onTransactionsBulkDeleted?.(idsToDelete);
      idsToDelete.forEach((id) => onTransactionDeleted?.(id));
      toast.success(
        res?.message ||
          `Successfully deleted ${idsToDelete.length} transaction${idsToDelete.length !== 1 ? "s" : ""}`,
      );
      setSelectedIds(new Set());
      setShowBulkDeleteModal(false);
    } catch (error: any) {
      console.error("Bulk delete transactions error:", error);
      toast.error(
        error?.response?.data?.detail || "Failed to bulk delete transactions",
      );
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleCompletePayment = async (id: string) => {
    setProcessingId(id);
    try {
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, payment_status: "Completed" } : t,
        ),
      );

      const res = await updateTransaction(id, {
        payment_status: "Completed",
      });

      const updated = localTransactions.find((t) => t.id === id);
      if (updated) {
        const fullUpdated = { ...updated, payment_status: "Completed", ...res };
        onTransactionUpdated?.(fullUpdated);
      }

      toast.success("Payment marked as Completed");
    } catch (error) {
      console.error(error);
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, payment_status: "Pending" } : t,
        ),
      );
      toast.error("Failed to update payment status");
    } finally {
      setProcessingId(null);
    }
  };

  const openManageModal = (tx: Transaction) => {
    setManageTx(tx);
    const driveTitle =
      typeof tx.donation === "object" ? (tx.donation as any)?.title : null;
    const rawApiName = tx.user_name || tx.user?.full_name;
    let initialName = "";
    if (rawApiName && rawApiName.trim().toLowerCase() !== "anonymous") {
      initialName = rawApiName.trim();
    } else if (
      tx.account_name &&
      tx.account_name !== driveTitle &&
      tx.account_name.toLowerCase() !== "donation"
    ) {
      initialName = tx.account_name.trim();
    }

    setFormData({
      account_name: initialName,
      account_number: tx.account_number || "",
      amount: tx.amount || 0,
      payment_status: tx.payment_status || "Pending",
      payment_method: tx.payment_method || "M-Pesa",
      transaction_reference: tx.transaction_reference || "",
      mpesa_receipt: tx.mpesa_receipt || "",
    });
  };

  const handleSaveManage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageTx) return;

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        account_name: formData.account_name || undefined,
        account_number: formData.account_number || undefined,
        amount: Number(formData.amount),
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
        transaction_reference: formData.transaction_reference || undefined,
        mpesa_receipt: formData.mpesa_receipt || undefined,
      };

      const res = await updateTransaction(manageTx.id, payload);

      const updatedTx: Transaction = {
        ...manageTx,
        ...res,
        amount: Number(formData.amount),
        payment_status: formData.payment_status,
        payment_method: formData.payment_method,
        account_name: formData.account_name,
        account_number: formData.account_number,
        user_name: res.user_name || formData.account_name || manageTx.user_name,
        transaction_reference: formData.transaction_reference,
        mpesa_receipt: formData.mpesa_receipt,
      };

      setLocalTransactions((prev) =>
        prev.map((t) => (t.id === manageTx.id ? updatedTx : t)),
      );

      onTransactionUpdated?.(updatedTx);
      toast.success("Transaction updated successfully");
      setManageTx(null);
    } catch (error: any) {
      console.error("Update transaction error:", error);
      toast.error(error?.response?.data?.detail || "Failed to update transaction");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteTx) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteTx.id);
      setLocalTransactions((prev) => prev.filter((t) => t.id !== deleteTx.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTx.id);
        return next;
      });
      onTransactionDeleted?.(deleteTx.id);
      toast.success("Transaction permanently deleted");
      setDeleteTx(null);
    } catch (error: any) {
      console.error("Delete transaction error:", error);
      toast.error(error?.response?.data?.detail || "Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  const getMethodIcon = (method: string) => {
    if (
      method?.toLowerCase().includes("mpesa") ||
      method?.toLowerCase().includes("mobile")
    ) {
      return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (method?.toLowerCase().includes("card")) {
      return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
    }
    return <Wallet className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-2">
            {title || "Recent Contributions"}
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c99335]/10 text-[#c99335] border border-[#c99335]/30">
                <Crown className="w-3 h-3" /> Super Admin
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {subtitle || "Live stream of incoming community donations"}
          </p>
        </div>
        {!isLoading && !hideLedgerLink && (
          <Link
            href="/donations"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            Full Ledger <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/80">
              {canDelete && (
                <th className="py-3 pl-4 w-10 rounded-l-xl">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={toggleSelectAll}
                      aria-label="Select all transactions"
                      className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer accent-[#c99335]"
                    />
                  </div>
                </th>
              )}
              <th className={clsx("py-3", !canDelete && "pl-4 rounded-l-xl")}>Donor</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Category</th>
              <th className="py-3">Method</th>
              <th className="py-3">Status</th>
              <th className="py-3">Time</th>
              <th className="py-3 pr-4 rounded-r-xl text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {canDelete && (
                      <td className="py-4 pl-4 w-10">
                        <Skeleton className="w-4 h-4 rounded" />
                      </td>
                    )}
                    <td className={clsx("py-4", !canDelete && "pl-4")}>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-xl" />
                        <Skeleton className="h-4 w-28 rounded-lg" />
                      </div>
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-20 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </td>
                    <td className="py-4 pr-4">
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </td>
                  </tr>
                ))
              : paginatedTransactions.map((transaction) => {
                  const driveTitle =
                    typeof transaction.donation === "object"
                      ? (transaction.donation as any)?.title
                      : null;
                  const rawApiName =
                    transaction.user_name || transaction.user?.full_name;
                  let name: string;
                  if (rawApiName && rawApiName.trim().toLowerCase() !== "anonymous") {
                    name = rawApiName.trim();
                  } else if (
                    transaction.account_name &&
                    transaction.account_name !== driveTitle &&
                    transaction.account_name.toLowerCase() !== "donation"
                  ) {
                    name = transaction.account_name.trim();
                  } else {
                    name = "Anonymous Donor";
                  }
                  const initial = name.charAt(0).toUpperCase() || "A";

                  return (
                    <tr
                      key={transaction.id}
                      className={clsx(
                        "group transition-colors",
                        selectedIds.has(transaction.id)
                          ? "bg-amber-500/10 hover:bg-amber-500/15"
                          : "hover:bg-amber-500/5",
                      )}
                    >
                      {canDelete && (
                        <td className="py-3.5 pl-4 w-10">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(transaction.id)}
                              onChange={() => toggleSelectRow(transaction.id)}
                              aria-label={`Select transaction ${transaction.id}`}
                              className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer accent-[#c99335]"
                            />
                          </div>
                        </td>
                      )}
                      <td className={clsx("py-3.5", !canDelete && "pl-4")}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-xs shadow-sm shadow-amber-500/20">
                            {initial}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors block">
                              {name}
                            </span>
                            {transaction.account_number && (
                              <span className="text-[11px] text-slate-400 font-mono block">
                                {transaction.account_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-extrabold text-sm text-slate-900">
                          KES {transaction.amount.toLocaleString()}
                        </div>
                        {transaction.transaction_reference && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {transaction.transaction_reference}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg text-nowrap">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          {getMethodIcon(transaction.payment_method)}
                          <span>{transaction.payment_method}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={clsx(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm inline-flex items-center gap-1",
                            transaction.payment_status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : transaction.payment_status === "Failed"
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/30",
                          )}
                        >
                          <span
                            className={clsx(
                              "w-1.5 h-1.5 rounded-full",
                              transaction.payment_status === "Completed"
                                ? "bg-emerald-500 animate-pulse"
                                : transaction.payment_status === "Failed"
                                ? "bg-rose-500"
                                : "bg-amber-500 animate-pulse",
                            )}
                          ></span>
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-slate-400 font-mono font-medium">
                        {transaction.donated_at
                          ? new Date(transaction.donated_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Just now"}
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Cash Payment Completion */}
                          {canManage &&
                            transaction.payment_status === "Pending" && (
                              <button
                                onClick={() =>
                                  handleCompletePayment(transaction.id)
                                }
                                disabled={processingId === transaction.id}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-xl transition-all"
                                title="Mark Payment as Completed"
                              >
                                {processingId === transaction.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                )}
                              </button>
                            )}

                          {/* Manage / Edit Transaction */}
                          {canManage && (
                            <button
                              onClick={() => openManageModal(transaction)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 rounded-xl transition-all"
                              title="Manage & Edit Transaction"
                            >
                              <SlidersHorizontal className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Transaction (Super Admin or donations.delete) */}
                          {canDelete && (
                            <button
                              onClick={() => setDeleteTx(transaction)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-all"
                              title="Delete Transaction Permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {!canManage && !canDelete && (
                            <div className="w-8 h-8 ml-auto flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <ShieldCheck className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {!isLoading && localTransactions.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="font-semibold text-sm">
            No recent donations found in system.
          </p>
        </div>
      )}

      {/* ==================== Pagination Controls ==================== */}
      {!isLoading && itemsPerPage && localTransactions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="text-slate-900 font-bold">
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-900 font-bold">
              {Math.min(startIndex + itemsPerPage, localTransactions.length)}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 font-bold">
              {localTransactions.length}
            </span>{" "}
            contributions
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-xs text-slate-400 font-bold"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(Number(page))}
                      className={clsx(
                        "w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        currentPage === page
                          ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-sm shadow-amber-500/20"
                          : "text-slate-600 hover:bg-slate-100 bg-white border border-slate-200/60",
                      )}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== Floating Bulk Actions Toolbar ==================== */}
      <AnimatePresence>
        {canDelete && selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="sticky bottom-4 z-30 mt-4 mx-auto w-full max-w-xl bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-sm border border-amber-500/30 shrink-0">
                {selectedIds.size}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-100 truncate">
                  {selectedIds.size} transaction{selectedIds.size !== 1 ? "s" : ""} selected
                </p>
                <p className="text-[11px] font-semibold text-amber-400">
                  Total: KES {totalSelectedAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== Manage Transaction Modal ==================== */}
      <AnimatePresence>
        {manageTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Manage Transaction
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {manageTx.transaction_reference || `ID: ${manageTx.id.slice(0, 13)}...`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setManageTx(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSaveManage}
                className="space-y-4 py-4 overflow-y-auto custom-scrollbar flex-1 pr-1"
              >
                {/* Donor Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Donor / Contributor Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) =>
                        setFormData({ ...formData, account_name: e.target.value })
                      }
                      placeholder="e.g. Ahmed Ali (or Anonymous)"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Account / Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone / Account Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.account_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          account_number: e.target.value,
                        })
                      }
                      placeholder="e.g. 254712345678"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono text-slate-900"
                    />
                  </div>
                </div>

                {/* Amount & Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Amount (KES)
                    </label>
                    <div className="relative">
                      <span className="text-xs font-bold text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        KES
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        required
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Payment Status
                    </label>
                    <select
                      value={formData.payment_status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_status: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-slate-900"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method & Receipt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-900"
                    >
                      <option value="M-Pesa">M-Pesa</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  {/* M-Pesa Receipt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Receipt / M-Pesa Code
                    </label>
                    <input
                      type="text"
                      value={formData.mpesa_receipt}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mpesa_receipt: e.target.value,
                        })
                      }
                      placeholder="e.g. QHX8923JKL"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono uppercase text-slate-900"
                    />
                  </div>
                </div>

                {/* Reference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={formData.transaction_reference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transaction_reference: e.target.value,
                      })
                    }
                    placeholder="e.g. TX-1234567890"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-mono text-slate-900"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => {
                        const target = manageTx;
                        setManageTx(null);
                        setDeleteTx(target);
                      }}
                      className="px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Transaction
                    </button>
                  ) : (
                    <div></div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setManageTx(null)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
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
        {deleteTx && (
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
                  <h3 className="text-lg font-bold text-slate-900">
                    Delete Transaction
                  </h3>
                  <span className="text-[10px] font-bold text-[#c99335] uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Super Admin Authorization
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Are you sure you want to permanently delete this transaction?
                This action is irreversible and will remove this contribution
                from all financial records, analytics, and donor history.
              </p>

              {/* Transaction Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Donor:</span>
                  <span className="font-bold text-slate-900">
                    {deleteTx.user_name ||
                      deleteTx.account_name ||
                      "Anonymous Donor"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Amount:</span>
                  <span className="font-extrabold text-slate-900">
                    KES {deleteTx.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Reference:</span>
                  <span className="font-mono text-slate-700">
                    {deleteTx.transaction_reference || deleteTx.id.slice(0, 16)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Status / Method:</span>
                  <span className="font-medium text-slate-700">
                    {deleteTx.payment_status} ({deleteTx.payment_method})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTx(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={isDeleting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== Bulk Delete Confirmation Modal ==================== */}
      <AnimatePresence>
        {showBulkDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Bulk Delete Transactions
                  </h3>
                  <span className="text-[10px] font-bold text-[#c99335] uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Super Admin Authorization
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Are you sure you want to permanently delete{" "}
                <strong className="text-rose-600 font-bold">
                  {selectedIds.size} transactions
                </strong>{" "}
                totaling{" "}
                <strong className="text-slate-900 font-bold">
                  KES {totalSelectedAmount.toLocaleString()}
                </strong>
                ? This action is irreversible and will permanently remove all selected
                contributions from records and financial ledgers.
              </p>

              {/* Selected Transactions Scrollable Preview */}
              <div className="flex-1 overflow-y-auto max-h-48 border border-slate-100 rounded-2xl bg-slate-50/80 p-3 space-y-2 mb-6 custom-scrollbar">
                {selectedTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-xl border border-slate-100 shadow-2xs"
                  >
                    <div className="min-w-0 pr-3">
                      <span className="font-bold text-slate-900 truncate block">
                        {tx.user_name || tx.account_name || "Anonymous Donor"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {tx.transaction_reference || `${tx.id.slice(0, 13)}...`}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-slate-900 block">
                        KES {tx.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {tx.payment_method} • {tx.payment_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBulkDeleteModal(false)}
                  disabled={isBulkDeleting}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkDeleteSubmit}
                  disabled={isBulkDeleting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isBulkDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting {selectedIds.size} Records...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete {selectedIds.size} Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
