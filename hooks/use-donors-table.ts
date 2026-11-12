import { useState, useEffect } from "react";
import { Donation } from "@/lib/data";
import { updateTransaction, deleteTransaction } from "@/lib/api_data";
import { toast } from "sonner";

export function useDonorsTable(initial: Donation[], onUpdate?: (d: Donation) => void, onDelete?: (id: string) => void) {
  const [donations, setDonations] = useState<Donation[]>([...initial]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [manageDonation, setManageDonation] = useState<Donation | null>(null);
  const [deleteDonation, setDeleteDonation] = useState<Donation | null>(null);
  const [isSaving, setIsSaving] = useState(false), [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({ account_name: "", amount: 0, payment_status: "Pending", payment_method: "M-Pesa" });

  useEffect(() => { setDonations([...initial]); }, [initial]);

  const handleComplete = async (id: string) => {
    setProcessingId(id);
    try {
      await updateTransaction(id, { payment_status: "Completed" });
      setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, status: "Completed" } : d)));
      toast.success("Payment marked as Completed");
    } finally { setProcessingId(null); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageDonation) return;
    setIsSaving(true);
    try {
      await updateTransaction(manageDonation.id, { amount: formData.amount, payment_status: formData.payment_status, payment_method: formData.payment_method });
      const updated = { ...manageDonation, donorName: formData.account_name, amount: formData.amount, status: formData.payment_status as any, paymentMethod: formData.payment_method as any };
      setDonations((p) => p.map((d) => (d.id === manageDonation.id ? updated : d)));
      onUpdate?.(updated);
      setManageDonation(null);
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteDonation) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deleteDonation.id);
      setDonations((p) => p.filter((d) => d.id !== deleteDonation.id));
      onDelete?.(deleteDonation.id);
      setDeleteDonation(null);
    } finally { setIsDeleting(false); }
  };

  return { donations, processingId, manageDonation, deleteDonation, isSaving, isDeleting, formData, setFormData, setManageDonation, setDeleteDonation, handleComplete, handleSave, handleDelete, openManage: (d: Donation) => { setManageDonation(d); setFormData({ account_name: d.donorName, amount: d.amount, payment_status: d.status, payment_method: d.paymentMethod }); } };
}
