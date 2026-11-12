import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { RoleDetail } from "@/lib/rbac_api";

interface Props {
  role: RoleDetail;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RoleDeleteModal({ role, submitting, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 text-rose-600 mb-3">
          <div className="p-2 rounded-xl bg-rose-50"><AlertTriangle className="w-6 h-6" /></div>
          <h3 className="text-lg font-bold text-gray-900">Delete Custom Role</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">
          Are you sure you want to permanently delete the role <strong className="text-gray-900">{role.role_name}</strong>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary py-2.5 px-4 text-xs">Cancel</button>
          <button onClick={onConfirm} disabled={submitting} className="btn-danger py-2.5 px-5 text-xs shadow-md">
            {submitting ? "Deleting..." : "Delete Role"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

