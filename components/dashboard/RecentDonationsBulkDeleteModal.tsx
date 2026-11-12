"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, Crown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  count: number;
  totalAmount: number;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RecentDonationsBulkDeleteModal({ isOpen, count, totalAmount, isDeleting, onClose, onConfirm }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-3 text-rose-600 mb-3">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100"><AlertTriangle className="w-6 h-6 text-rose-600" /></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bulk Delete Transactions</h3>
              <span className="text-[10px] font-bold text-[#c99335] uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" /> Super Admin Authorization
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            You are about to permanently delete <span className="font-bold text-slate-900">{count} selected transactions</span> totaling <span className="font-bold text-slate-900">KES {totalAmount.toLocaleString()}</span>. This action cannot be reversed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isDeleting} className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="button" onClick={onConfirm} disabled={isDeleting} className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50">
              {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : `Delete ${count} Records`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
