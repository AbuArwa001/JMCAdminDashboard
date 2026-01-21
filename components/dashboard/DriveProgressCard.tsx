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

export default function DriveProgressCard({
  drive,
  onUpdate,
}: {
  drive: DonationDrive;
  onUpdate?: () => void;
}) {
  const [category, loadCategory] = useState<CategoryData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const progress = Math.min(
    100,
    Math.round((drive.collected_amount / drive.target_amount) * 100),
  );

  let progressColor = "bg-primary"; // Default Gold
  if (drive.status === "Closed")
    progressColor = "bg-gray-400"; // Grey for closed
  else if (progress >= 100)
    progressColor = "bg-primary-green"; // Completed
  else if (progress < 20)
    progressColor = "bg-red-500"; // Low
  else progressColor = "bg-primary-bronze"; // Mid

  useEffect(() => {
    const load = async () => {
      const cat = await getCategoryById(drive.category);
      return cat;
    };
    const fetchCategory = async () => {
      const cat = await load();
      loadCategory(cat);
    };
    fetchCategory();
  }, [category, drive.category]);

  // console.log('Loaded category:', category);
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
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md flex flex-col h-full relative group">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4
            className="font-bold text-gray-900 line-clamp-1"
            title={drive.title}
          >
            {drive.title}
          </h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">
            {category?.category_name || "Loading..."}
          </span>
        </div>
        <span
          className={clsx(
            "text-xs font-bold px-2 py-1 rounded-lg bg-secondary",
            drive.status === "Closed"
              ? "text-gray-500 bg-gray-200"
              : "text-primary-bronze",
          )}
        >
          {drive.status}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Collected</span>
          <span className="font-bold text-gray-900">
            KES {drive.collected_amount.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={clsx(
              "h-2.5 rounded-full transition-all duration-500",
              progressColor,
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Target: KES {drive.target_amount.toLocaleString()}</span>
          <span>{progress}% Reached</span>
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-50 space-y-2">
        <div className="flex gap-2">
          <Link
            href={`/drives/${drive.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-bronze transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
          <Link
            href={`/drives/${drive.id}/edit`}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 border text-xs font-medium rounded-lg transition-colors",
              drive.status === "Active"
                ? "bg-white border-green-200 text-green-700 hover:bg-green-50"
                : "bg-white border-amber-200 text-amber-700 hover:bg-amber-50",
            )}
          >
            {isUpdating ? (
              "..."
            ) : drive.status === "Active" ? (
              <>
                <CheckCircle className="w-4 h-4" /> Close
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> Re-Activate
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            {isDeleting ? (
              "..."
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
