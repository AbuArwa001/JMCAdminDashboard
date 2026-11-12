import { AlertTriangle, Loader2, Crown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Transaction } from "@/lib/data";

interface Props {
  deleteTx: Transaction | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RecentDonationsSingleDeleteModal({ deleteTx, isDeleting, onClose, onConfirm }: Props) {
  if (!deleteTx) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 text-rose-600 mb-3">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <AlertTriangle className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Transaction</h3>
              <span className="text-[10px] font-bold text-[#c99335] uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3" /> Super Admin Authorization
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Are you sure you want to permanently delete this transaction? This action is irreversible.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Donor:</span>
              <span className="font-bold text-slate-900">{deleteTx.user_name || deleteTx.account_name || "Anonymous Donor"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Amount:</span>
              <span className="font-extrabold text-slate-900">KES {deleteTx.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Reference:</span>
              <span className="font-mono text-slate-700">{deleteTx.transaction_reference || deleteTx.id.slice(0, 16)}</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isDeleting} className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="button" onClick={onConfirm} disabled={isDeleting} className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50">
              {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : "Delete Permanently"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
