import clsx from "clsx";
import { CheckCircle, SlidersHorizontal, Trash2, Loader2 } from "lucide-react";
import { Donation } from "@/lib/data";

interface Props {
  donation: Donation;
  canManage: boolean;
  canDelete: boolean;
  processingId: string | null;
  onComplete: (id: string) => void;
  onEdit: (d: Donation) => void;
  onDelete: (d: Donation) => void;
}

export function DonorsTableRow({ donation, canManage, canDelete, processingId, onComplete, onEdit, onDelete }: Props) {
  const isCompleted = donation.status === "Completed";

  return (
    <tr className="hover:bg-amber-500/5 transition-colors group">
      <td className="py-3.5 pl-2 text-sm font-bold text-gray-900">{donation.donorName}</td>
      <td className="py-3.5 text-sm font-extrabold text-gray-900">KES {donation.amount.toLocaleString()}</td>
      <td className="py-3.5 text-xs font-semibold text-gray-600">{donation.paymentMethod}</td>
      <td className="py-3.5 text-xs text-gray-400 font-mono">{new Date(donation.date).toLocaleDateString()}</td>
      <td className="py-3.5">
        <span className={clsx("text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm inline-flex items-center gap-1", isCompleted ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30")}>
          <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", isCompleted ? "bg-emerald-500" : "bg-amber-500")} />
          {donation.status}
        </span>
      </td>
      <td className="py-3.5 pr-2 text-right">
        <div className="flex items-center justify-end gap-1">
          {canManage && !isCompleted && (
            <button onClick={() => onComplete(donation.id)} disabled={processingId === donation.id} className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Mark as Completed">
              {processingId === donation.id ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> : <CheckCircle className="w-4 h-4" />}
            </button>
          )}
          {canManage && (
            <button onClick={() => onEdit(donation)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Manage Record">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => onDelete(donation)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete Record">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
