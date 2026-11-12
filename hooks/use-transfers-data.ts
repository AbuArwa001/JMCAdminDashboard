import { useState, useEffect } from "react";
import { BankAccount, Transfer } from "@/lib/data";
import { getBankAccounts, getTransferHistory, initiateTransfer } from "@/lib/api_data";
import { toast } from "sonner";

export function useTransfersData(initialTo: string) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [history, setHistory] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ destination_account: initialTo, amount: "", description: "Transfer from JMC Donation Account" });

  const refresh = async () => {
    try {
      setIsLoading(true);
      const [accs, hist] = await Promise.all([getBankAccounts(), getTransferHistory()]);
      setAccounts(accs);
      setHistory(hist);
    } catch { toast.error("Failed to load transfers."); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination_account || !formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please fill in valid destination and amount.");
      return;
    }
    setIsSubmitting(true);
    try {
      await initiateTransfer(Number(formData.amount), formData.destination_account, formData.description);
      toast.success("Transfer initiated successfully.");
      setFormData({ destination_account: "", amount: "", description: "Transfer from JMC Donation Account" });
      refresh();
    } catch { toast.error("Failed to initiate transfer."); }
    finally { setIsSubmitting(false); }
  };

  return { accounts, history, isLoading, isSubmitting, formData, setFormData, handleSend, refresh };
}

