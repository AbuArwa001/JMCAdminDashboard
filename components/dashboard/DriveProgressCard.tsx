import { CategoryData, DonationDrive, RECENT_DONATIONS } from "@/lib/data";
import clsx from "clsx";
import Link from "next/link";
import {
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  QrCode,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getCategoryById,
  deleteDonationDrive,
  updateDonationDrive,
} from "@/lib/api_data";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/Skeleton";
import QRCodeModal from "@/components/dashboard/QRCodeModal";

interface DriveProgressCardProps {
  drive?: DonationDrive & { categoryName?: string };
  onUpdate?: () => void;
  isLoading?: boolean;
}

export default function DriveProgressCard({
  drive,
  onUpdate,
  isLoading,
}: DriveProgressCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  if (isLoading || !drive) {
    return (
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] flex flex-col h-full space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-6 w-36 rounded-xl" />
            <Skeleton className="h-4 w-24 mt-2 rounded-full" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="space-y-3 pt-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
        <div className="mt-auto flex gap-3 pt-4">
          <Skeleton className="h-10 flex-1 rounded-2xl" />
          <Skeleton className="h-10 w-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  const progress = Math.min(
    100,
    Math.round((drive.collected_amount / drive.target_amount) * 100),
  );

  let progressTrack = "bg-slate-100";
  let progressFill = "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300";

  if (drive.status === "Closed") {
    progressFill = "bg-slate-400";
  } else if (progress >= 100) {
    progressFill = "bg-gradient-to-r from-emerald-500 to-teal-400";
  }

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this donation drive? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);
    try {
      await deleteDonationDrive(drive.id);
      toast.success("Donation drive deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to delete donation drive");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = drive.status === "Active" ? "Closed" : "Active";
    if (!confirm(`Are you sure you want to mark this drive as ${newStatus}?`))
      return;

    setIsUpdating(true);
    try {
      await updateDonationDrive(drive.id, { status: newStatus } as any);
      toast.success(`Drive marked as ${newStatus}`);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleFeatured = async () => {
    const newFeaturedStatus = !drive.is_featured;
    const action = newFeaturedStatus
      ? "mark as featured"
      : "remove from featured";

    if (!confirm(`Are you sure you want to ${action}?`)) return;

    setIsUpdating(true);
    try {
      await updateDonationDrive(drive.id, {
        is_featured: newFeaturedStatus,
      } as any);
      toast.success(
        `Drive ${newFeaturedStatus ? "marked as featured" : "removed from featured"}`,
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update featured status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 hover:border-amber-500/40 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.18)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative group overflow-hidden">
      {/* Ambient Radial Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-500 pointer-events-none blur-xl" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 mr-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
              {drive.categoryName || "General"}
            </span>
            {drive.is_featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
              </span>
            )}
          </div>
          <h4
            className="font-extrabold text-slate-900 text-lg line-clamp-1 leading-tight tracking-tight group-hover:text-amber-700 transition-colors"
            title={drive.title}
          >
            {drive.title}
          </h4>
        </div>
        <span
          className={clsx(
            "text-[11px] font-bold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1.5 shrink-0",
            drive.status === "Closed"
              ? "text-slate-500 bg-slate-100 border-slate-200"
              : "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
          )}
        >
          <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", drive.status === "Closed" ? "bg-slate-400" : "bg-emerald-500")}></span>
          {drive.status}
        </span>
      </div>

      <div className="my-4 relative z-10 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Raised
            </p>
            <p className="text-2xl font-extrabold text-slate-900 leading-none mt-1">
              KES {drive.collected_amount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
              {progress}%
            </span>
          </div>
        </div>

        {/* Shimmering Progress Bar */}
        <div
          className={clsx(
            "w-full h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50",
            progressTrack,
          )}
        >
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden",
              progressFill,
            )}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Target Goal</span>
          <span className="font-bold text-slate-700">
            KES {drive.target_amount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
        <Link
          href={`/drives/${drive.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-slate-900/10 group-hover:bg-amber-500 group-hover:text-slate-950"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleFeatured}
            disabled={isUpdating}
            className={clsx(
              "p-2 rounded-xl transition-colors border border-transparent",
              drive.is_featured
                ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
                : "text-slate-400 hover:text-amber-500 hover:bg-amber-500/10",
            )}
            title={drive.is_featured ? "Remove from Featured" : "Mark as Featured"}
          >
            <Star
              className={clsx("w-4 h-4", drive.is_featured && "fill-amber-500")}
            />
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Generate QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <Link
            href={`/drives/${drive.id}/edit`}
            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 rounded-xl transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>

          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={clsx(
              "p-2 rounded-xl transition-colors",
              drive.status === "Active"
                ? "text-amber-600 hover:bg-amber-50"
                : "text-emerald-600 hover:bg-emerald-50",
            )}
            title={drive.status === "Active" ? "Close Drive" : "Re-activate Drive"}
          >
            {drive.status === "Active" ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        value={`jamiagive://donate/${drive.id}`}
        title={drive.title}
      />
    </div>
  );
}

