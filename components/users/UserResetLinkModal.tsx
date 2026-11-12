import { KeyRound, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Props {
  resetData: { email: string; link: string };
  onClose: () => void;
}

export function UserResetLinkModal({ resetData, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><KeyRound className="w-5 h-5" /></div>
          <h3 className="text-base font-bold text-gray-900">Password Reset Clearance Link</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Share this secure link with <strong>{resetData.email}</strong> to set their credentials.
        </p>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
          <input type="text" readOnly value={resetData.link} className="bg-transparent text-xs text-gray-700 flex-1 outline-none font-mono truncate" />
          <button onClick={() => { navigator.clipboard.writeText(resetData.link); toast.success("Link copied"); }} className="p-2 text-gray-500 hover:text-gray-900 rounded-lg">
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="btn-primary py-2 px-6 text-xs shadow-gold-sm">Done</button>
        </div>
      </motion.div>
    </div>
  );
}

