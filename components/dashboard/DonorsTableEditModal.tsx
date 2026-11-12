import { X, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Donation } from "@/lib/data";

interface Props {
  donation: Donation | null;
  formData: { account_name: string; amount: number; payment_status: string; payment_method: string };
  isSaving: boolean;
  onChange: (data: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DonorsTableEditModal({ donation, formData, isSaving, onChange, onClose, onSubmit }: Props) {
  if (!donation) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-base">Edit Donation Record</h4>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 pt-4">
            <div>
              <label className="form-label">Donor Name</label>
              <input value={formData.account_name} onChange={(e) => onChange({ ...formData, account_name: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label">Amount (KES)</label>
              <input type="number" required min="1" value={formData.amount} onChange={(e) => onChange({ ...formData, amount: Number(e.target.value) })} className="form-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Status</label>
                <select value={formData.payment_status} onChange={(e) => onChange({ ...formData, payment_status: e.target.value })} className="form-input">
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="form-label">Method</label>
                <select value={formData.payment_method} onChange={(e) => onChange({ ...formData, payment_method: e.target.value })} className="form-input">
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank">Bank</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button type="button" onClick={onClose} disabled={isSaving} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={isSaving} className="btn-primary flex-1">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

