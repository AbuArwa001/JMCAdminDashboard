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

  if (isLoading || !drive) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-4 w-20 mt-2 rounded-full" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="mb-6 space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="mt-auto flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  const progress = Math.min(
    100,
    Math.round((drive.collected_amount / drive.target_amount) * 100),
  );

  let progressTrack = "bg-gray-100";
  let progressFill = "bg-primary";

  if (drive.status === "Closed") {
    progressFill = "bg-gray-400";
  } else if (progress >= 100) {
    progressFill = "bg-green-500";
    progressTrack = "bg-green-100";
  } else if (progress < 20) {
    progressFill = "bg-red-500";
    progressTrack = "bg-red-100";
  }

  const handleExport = () => {
    const driveDonations = RECENT_DONATIONS.filter(
      (d) => d.driveId === drive.id,
    );
    exportToCSV(
      driveDonations,
      `${drive.title.replace(/\s+/g, "_").toLowerCase()}_donations`,
    );
  };

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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 flex flex-col h-full relative group overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 blur-2xl" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex-1 mr-4">
          <h4
            className="font-bold text-secondary-dark text-lg line-clamp-1 leading-tight"
            title={drive.title}
          >
            {drive.title}
          </h4>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full mt-2 inline-block uppercase tracking-wider">
            {drive.categoryName || "General"}
          </span>
        </div>
        <span
          className={clsx(
            "text-xs font-bold px-3 py-1 rounded-full border",
            drive.status === "Closed"
              ? "text-gray-500 bg-gray-100 border-gray-200"
              : "text-green-700 bg-green-50 border-green-100",
          )}
        >
          {drive.status}
        </span>
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Collected
            </p>
            <p className="text-2xl font-bold text-secondary-dark leading-none mt-1">
              KES {drive.collected_amount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">
              {progress}% Goal
            </p>
          </div>
        </div>

        <div
          className={clsx(
            "w-full h-3 rounded-full overflow-hidden",
            progressTrack,
          )}
        >
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-1000 ease-out",
              progressFill,
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="mt-2 text-right">
          <p className="text-xs text-gray-400">
            Target:{" "}
            <span className="font-mono text-gray-600">
              KES {drive.target_amount.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2 relative z-10">
        <Link
          href={`/drives/${drive.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-secondary-dark text-white text-sm font-medium rounded-xl hover:bg-black transition-all shadow-lg shadow-black/10"
        >
          <Eye className="w-4 h-4" />
          View
        </Link>

        <div className="flex gap-1">
          <Link
            href={`/drives/${drive.id}/edit`}
            className="p-2.5 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors border border-transparent hover:border-primary/10"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={clsx(
              "p-2.5 rounded-xl transition-colors border border-transparent",
              drive.status === "Active"
                ? "text-amber-600 hover:bg-amber-50 hover:border-amber-100"
                : "text-green-600 hover:bg-green-50 hover:border-green-100",
            )}
            title={
              drive.status === "Active" ? "Close Drive" : "Re-activate Drive"
            }
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
            className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
