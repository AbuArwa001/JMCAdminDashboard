"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { DonationDrive } from "@/lib/data";
import { deleteDonationDrive, updateDonationDrive } from "@/lib/api_data";
import QRCodeModal from "@/components/dashboard/QRCodeModal";
import { DriveCardSkeleton } from "./DriveCardSkeleton";
import { DriveProgressBar } from "./DriveProgressBar";
import { DriveCardActions } from "./DriveCardActions";

interface DriveProgressCardProps {
  drive?: DonationDrive & { categoryName?: string };
  onUpdate?: () => void;
  isLoading?: boolean;
}

export default function DriveProgressCard({ drive, onUpdate, isLoading }: DriveProgressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  if (isLoading || !drive) return <DriveCardSkeleton />;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this donation drive?")) return;
    setIsDeleting(true);
    try { await deleteDonationDrive(drive.id); toast.success("Deleted successfully"); onUpdate?.(); }
    catch { toast.error("Failed to delete"); }
    finally { setIsDeleting(false); }
  };

  const handleToggleStatus = async () => {
    const newStatus = drive.status === "Active" ? "Closed" : "Active";
    if (!confirm(`Mark drive as ${newStatus}?`)) return;
    setIsUpdating(true);
    try { await updateDonationDrive(drive.id, { status: newStatus } as any); toast.success(`Marked ${newStatus}`); onUpdate?.(); }
    catch { toast.error("Failed to update status"); }
    finally { setIsUpdating(false); }
  };

  const handleToggleFeatured = async () => {
    const nextVal = !drive.is_featured;
    setIsUpdating(true);
    try { await updateDonationDrive(drive.id, { is_featured: nextVal } as any); toast.success(nextVal ? "Marked featured" : "Removed featured"); onUpdate?.(); }
    catch { toast.error("Failed to update featured status"); }
    finally { setIsUpdating(false); }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 hover:border-amber-500/40 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.18)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative group overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 mr-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">{drive.categoryName || "General"}</span>
            {drive.is_featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured</span>
            )}
          </div>
          <h4 className="font-extrabold text-slate-900 text-lg line-clamp-1 leading-tight tracking-tight group-hover:text-amber-700 transition-colors" title={drive.title}>{drive.title}</h4>
        </div>
        <span className={clsx("text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 shrink-0", drive.status === "Closed" ? "text-slate-500 bg-slate-100 border-slate-200" : "text-emerald-600 bg-emerald-500/10 border-emerald-500/30")}>
          <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", drive.status === "Closed" ? "bg-slate-400" : "bg-emerald-500")} />
          {drive.status}
        </span>
      </div>

      <DriveProgressBar collected={drive.collected_amount} target={drive.target_amount} status={drive.status} />
      <DriveCardActions driveId={drive.id} isFeatured={drive.is_featured} status={drive.status} isUpdating={isUpdating} isDeleting={isDeleting} onToggleFeatured={handleToggleFeatured} onOpenQR={() => setIsQRModalOpen(true)} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} value={`jamiagive://donate/${drive.id}`} title={drive.title} />
    </div>
  );
}
