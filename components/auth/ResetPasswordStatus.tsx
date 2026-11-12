import Link from "next/link";
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export function ResetPasswordLoading() {
  return (
    <div className="py-12 flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#c99335]" />
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verifying Security Code...</p>
    </div>
  );
}

export function ResetPasswordError({ error }: { error: string }) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-center space-y-2">
        <AlertTriangle className="w-7 h-7 mx-auto text-rose-600" />
        <p className="text-xs font-medium leading-relaxed">{error}</p>
      </div>
      <Link href="/forgot-password" className="w-full py-3 bg-[#1a1512] hover:bg-[#2d2520] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2">
        Request New Link
      </Link>
    </div>
  );
}

export function ResetPasswordSuccess() {
  return (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
        <h3 className="font-bold text-sm">Password Successfully Reset</h3>
        <p className="text-xs text-emerald-700">You can now access your executive account using your new credentials.</p>
      </div>
      <Link href="/login" className="w-full py-3 bg-[#1a1512] hover:bg-[#2d2520] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2">
        Proceed to Portal Login <ArrowRight className="w-4 h-4 text-[#c99335]" />
      </Link>
    </div>
  );
}

