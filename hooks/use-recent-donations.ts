import { useState, useEffect } from "react";
import { Transaction } from "@/lib/data";
import { updateTransaction, deleteTransaction, bulkDeleteTransactions } from "@/lib/api_data";

export function useRecentDonations(initialTx: Transaction[], onDel?: (id: string) => void, onBulkDel?: (ids: string[]) => void, onUp?: (tx: Transaction) => void) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTx);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set()), [currentPage, setCurrentPage] = useState(1);
  const [manageTx, setManageTx] = useState<Transaction | null>(null), [deleteTx, setDeleteTx] = useState<Transaction | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false), [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => { setTransactions(initialTx); }, [initialTx]);

  const handleComplete = async (id: string) => {
    const res = await updateTransaction(id, { payment_status: "Completed" });
    setTransactions((p) => p.map((t) => (t.id === id ? { ...t, payment_status: "Completed", ...res } : t)));
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const ids = Array.from(selectedIds);
      await bulkDeleteTransactions(ids);
      setTransactions((p) => p.filter((t) => !selectedIds.has(t.id)));
      onBulkDel?.(ids);
      setSelectedIds(new Set());
      setShowBulkModal(false);
    } finally { setIsDeleting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTx) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteTx.id);
      setTransactions((p) => p.filter((t) => t.id !== deleteTx.id));
      onDel?.(deleteTx.id);
      setDeleteTx(null);
    } finally { setIsDeleting(false); }
  };

  const openManage = (tx: Transaction) => {
    setManageTx(tx);
    setFormData({ account_name: tx.user_name || tx.account_name || "", amount: tx.amount, payment_status: tx.payment_status || "Pending", payment_method: tx.payment_method || "M-Pesa" });
  };

  return { transactions, selectedIds, currentPage, manageTx, deleteTx, showBulkModal, isSaving, isDeleting, formData, setSelectedIds, setCurrentPage, setManageTx, setDeleteTx, setShowBulkModal, setFormData, handleComplete, handleBulkDelete, handleDelete, openManage };
}
