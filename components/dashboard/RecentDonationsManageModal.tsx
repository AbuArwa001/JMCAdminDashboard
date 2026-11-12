import { X, Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Transaction } from "@/lib/data";

interface Props {
  manageTx: Transaction | null;
  formData: any;
  isSaving: boolean;
  canDelete: boolean;
  onChange: (data: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteClick: (tx: Transaction) => void;
}

export function RecentDonationsManageModal({ manageTx, formData, isSaving, canDelete, onChange, onClose, onSubmit, onDeleteClick }: Props) {
  if (!manageTx) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Manage Transaction</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donor Name</label>
                <input value={formData.account_name} onChange={(e) => onChange({ ...formData, account_name: e.target.value })} className="form-input text-xs" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (KES)</label>
                <input type="number" min="1" value={formData.amount} onChange={(e) => onChange({ ...formData, amount: Number(e.target.value) })} className="form-input text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <select value={formData.payment_status} onChange={(e) => onChange({ ...formData, payment_status: e.target.value })} className="form-input text-xs">
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Method</label>
                <select value={formData.payment_method} onChange={(e) => onChange({ ...formData, payment_method: e.target.value })} className="form-input text-xs">
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              {canDelete ? (
                <button type="button" onClick={() => { const target = manageTx; onClose(); onDeleteClick(target); }} className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-primary py-2 text-xs">
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
