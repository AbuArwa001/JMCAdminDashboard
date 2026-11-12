"use client";

import { Transaction } from "@/lib/data";
import { useRBAC } from "@/hooks/useRBAC";
import { useRecentDonations } from "@/hooks/use-recent-donations";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Trash2 } from "lucide-react";
import { RecentDonationsTableRow } from "./RecentDonationsTableRow";
import { RecentDonationsPagination } from "./RecentDonationsPagination";
import { RecentDonationsBulkDeleteModal } from "./RecentDonationsBulkDeleteModal";
import { RecentDonationsSingleDeleteModal } from "./RecentDonationsSingleDeleteModal";
import { RecentDonationsManageModal } from "./RecentDonationsManageModal";

interface Props {
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

export default function RecentDonationsTable({ transactions: initialTx, isLoading, onTransactionDeleted, onTransactionsBulkDeleted, onTransactionUpdated, itemsPerPage, title, subtitle, hideLedgerLink }: Props) {
  const { isSuperAdmin, hasPermission } = useRBAC();
  const canDelete = isSuperAdmin || hasPermission("donations.delete");
  const canManage = isSuperAdmin || hasPermission("donations.manage");

  const {
    transactions, selectedIds, currentPage, manageTx, deleteTx, showBulkModal, isSaving, isDeleting, formData,
    setSelectedIds, setCurrentPage, setManageTx, setDeleteTx, setShowBulkModal, setFormData,
    handleComplete, handleSave, handleBulkDelete, handleDelete, openManage,
  } = useRecentDonations(initialTx, onTransactionDeleted, onTransactionsBulkDeleted, onTransactionUpdated);

  const totalPages = itemsPerPage ? Math.ceil(transactions.length / itemsPerPage) : 1;
  const start = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;
  const list = itemsPerPage ? transactions.slice(start, start + itemsPerPage) : transactions;
  const selectedAmount = transactions.filter((t) => selectedIds.has(t.id)).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-2">{title || "Recent Contributions"}<ShieldCheck className="w-4 h-4 text-emerald-500" /></h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle || "Live donor ledger across all campaigns"}</p>
        </div>
        <div className="flex items-center gap-2">
          {canDelete && selectedIds.size > 0 && (
            <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200">
              <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.size})
            </button>
          )}
          {!hideLedgerLink && <Link href="/donations" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">Full Ledger <ArrowUpRight className="w-3.5 h-3.5" /></Link>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-10"><input type="checkbox" checked={selectedIds.size === list.length && list.length > 0} onChange={() => setSelectedIds(selectedIds.size === list.length ? new Set() : new Set(list.map((t) => t.id)))} /></th>
              <th className="py-3 px-4">Donor</th><th className="py-3 px-4">Campaign</th><th className="py-3 px-4">Amount</th><th className="py-3 px-4">Method</th><th className="py-3 px-4">Date</th><th className="py-3 px-4">Status</th><th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (<tr key={i}><td colSpan={8} className="p-4"><Skeleton className="h-6 w-full" /></td></tr>)) : list.map((tx) => (
              <RecentDonationsTableRow key={tx.id} tx={tx} isSelected={selectedIds.has(tx.id)} canManage={canManage} canDelete={canDelete} processingId={null} onToggleSelect={(id) => { const n = new Set(selectedIds); if (n.has(id)) n.delete(id); else n.add(id); setSelectedIds(n); }} onComplete={handleComplete} onManage={openManage} onDelete={setDeleteTx} />
            ))}
          </tbody>
        </table>
      </div>
      <RecentDonationsPagination currentPage={currentPage} totalPages={totalPages} totalItems={transactions.length} startIndex={start} itemsPerPage={itemsPerPage || transactions.length} onPageChange={setCurrentPage} />
      <RecentDonationsBulkDeleteModal isOpen={showBulkModal} count={selectedIds.size} totalAmount={selectedAmount} isDeleting={isDeleting} onClose={() => setShowBulkModal(false)} onConfirm={handleBulkDelete} />
      <RecentDonationsSingleDeleteModal deleteTx={deleteTx} isDeleting={isDeleting} onClose={() => setDeleteTx(null)} onConfirm={handleDelete} />
      <RecentDonationsManageModal manageTx={manageTx} formData={formData} isSaving={isSaving} canDelete={canDelete} onChange={setFormData} onClose={() => setManageTx(null)} onSubmit={handleSave} onDeleteClick={setDeleteTx} />
    </div>
  );
}
