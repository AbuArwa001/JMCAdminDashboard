import Link from "next/link";
import { Eye, Edit, Trash2, CheckCircle, XCircle, Star, QrCode } from "lucide-react";
import clsx from "clsx";

interface Props {
  driveId: string;
  isFeatured?: boolean;
  status: string;
  isUpdating: boolean;
  isDeleting: boolean;
  onToggleFeatured: () => void;
  onOpenQR: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export function DriveCardActions({ driveId, isFeatured, status, isUpdating, isDeleting, onToggleFeatured, onOpenQR, onToggleStatus, onDelete }: Props) {
  return (
    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
      <Link href={`/drives/${driveId}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md group-hover:bg-amber-500 group-hover:text-slate-950">
        <Eye className="w-4 h-4" /> View Details
      </Link>
      <div className="flex items-center gap-1">
        <button onClick={onToggleFeatured} disabled={isUpdating} className={clsx("p-2 rounded-xl transition-colors border border-transparent", isFeatured ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : "text-slate-400 hover:text-amber-500 hover:bg-amber-500/10")} title="Featured">
          <Star className={clsx("w-4 h-4", isFeatured && "fill-amber-500")} />
        </button>
        <button onClick={onOpenQR} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" title="QR Code">
          <QrCode className="w-4 h-4" />
        </button>
        <Link href={`/drives/${driveId}/edit`} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 rounded-xl transition-colors" title="Edit">
          <Edit className="w-4 h-4" />
        </Link>
        <button onClick={onToggleStatus} disabled={isUpdating} className={clsx("p-2 rounded-xl transition-colors", status === "Active" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50")} title={status === "Active" ? "Close Drive" : "Activate"}>
          {status === "Active" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
        </button>
        <button onClick={onDelete} disabled={isDeleting} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
