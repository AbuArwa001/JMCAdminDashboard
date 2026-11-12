import clsx from "clsx";
import { CheckCircle, CreditCard, Wallet, Smartphone, ShieldCheck, Trash2, SlidersHorizontal, Loader2 } from "lucide-react";
import { Transaction } from "@/lib/data";

interface Props {
  tx: Transaction;
  isSelected: boolean;
  canManage: boolean;
  canDelete: boolean;
  processingId: string | null;
  onToggleSelect: (id: string) => void;
  onComplete: (id: string) => void;
  onManage: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
}

function MethodIcon({ method }: { method?: string }) {
  if (method === "Cash") return <Wallet className="w-3.5 h-3.5 text-slate-500" />;
  if (method === "Bank Transfer") return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
  return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
}

export function RecentDonationsTableRow({ tx, isSelected, canManage, canDelete, processingId, onToggleSelect, onComplete, onManage, onDelete }: Props) {
  const isCompleted = tx.payment_status === "Completed";
  const name = tx.user_name || tx.account_name || tx.user?.full_name || "Anonymous Donor";

  return (
    <tr className={clsx("transition-colors group", isSelected ? "bg-amber-500/10" : "hover:bg-slate-50/80")}>
      <td className="py-3.5 px-4">
        <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(tx.id)} className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/30 cursor-pointer" />
      </td>
      <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-extrabold text-[11px] shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="truncate max-w-[150px]">{name}</span>
        </div>
      </td>
      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 truncate max-w-[140px]">{tx.donation?.title || tx.category || "General Fund"}</td>
      <td className="py-3.5 px-4 text-xs font-extrabold text-slate-900 font-mono">KES {tx.amount.toLocaleString()}</td>
      <td className="py-3.5 px-4 text-xs text-slate-500 flex items-center gap-1.5 pt-4"><MethodIcon method={tx.payment_method} /><span>{tx.payment_method || "M-Pesa"}</span></td>
      <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">{new Date(tx.donated_at || tx.date || Date.now()).toLocaleDateString()}</td>
      <td className="py-3.5 px-4">
        <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1", isCompleted ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30")}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", isCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />{tx.payment_status || "Pending"}
        </span>
      </td>
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {canManage && !isCompleted && (
            <button onClick={() => onComplete(tx.id)} disabled={processingId === tx.id} className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg" title="Complete">
              {processingId === tx.id ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> : <CheckCircle className="w-4 h-4" />}
            </button>
          )}
          {canManage && <button onClick={() => onManage(tx)} className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg" title="Manage"><SlidersHorizontal className="w-4 h-4" /></button>}
          {canDelete && <button onClick={() => onDelete(tx)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>}
        </div>
      </td>
    </tr>
  );
}

