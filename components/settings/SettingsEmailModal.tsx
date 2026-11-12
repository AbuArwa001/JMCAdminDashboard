import { useState } from "react";
import { Shield, X, Check, Eye, EyeOff, AlertTriangle, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  initialEmail: string;
  newEmail: string;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
}

export function SettingsEmailModal({ initialEmail, newEmail, onClose, onConfirm }: Props) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("Please enter your current password."); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm(password);
    } catch (err: any) {
      setError(err.message || "Failed to update email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 16 }} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600"><Shield className="w-5 h-5" /></div>
            <div>
              <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-cinzel), serif" }}>Authorize Email Change</h3>
              <p className="text-xs text-gray-500 font-medium">Security verification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
          <div className="flex items-center justify-between"><span className="text-gray-500">Current:</span><span className="font-mono text-gray-700 line-through">{initialEmail}</span></div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-200"><span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> New:</span><span className="font-mono text-emerald-700 font-bold">{newEmail}</span></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label text-xs">Current Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="form-input pr-10 text-sm" placeholder="Enter password" required autoFocus />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" /><span>{error}</span></div>}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting || !password} className="flex-1 py-2.5 px-4 rounded-xl bg-[#006838] hover:bg-[#00552e] text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60">
              {isSubmitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Verifying...</span></> : <><Lock className="w-3.5 h-3.5" /><span>Authorize</span></>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

