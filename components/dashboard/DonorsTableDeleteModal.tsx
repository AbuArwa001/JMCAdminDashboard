"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Donation } from "@/lib/data";

interface Props {
  donation: Donation | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DonorsTableDeleteModal({ donation, isDeleting, onClose, onConfirm }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!donation || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-gray-900 text-lg mb-2">Delete Transaction Record?</h4>
          <p className="text-xs text-gray-500 mb-6">
            Are you sure you want to permanently delete the contribution of <span className="font-bold text-gray-800">KES {donation.amount?.toLocaleString()}</span> by <span className="font-bold text-gray-800">{donation.donorName || "Anonymous"}</span>?
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={isDeleting} className="btn-secondary flex-1 py-3">Cancel</button>
            <button type="button" onClick={onConfirm} disabled={isDeleting} className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete Permanently
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
