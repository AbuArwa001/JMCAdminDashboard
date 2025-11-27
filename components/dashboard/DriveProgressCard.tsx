import { DonationDrive, RECENT_DONATIONS } from "@/lib/data";
import clsx from "clsx";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { exportToCSV } from "@/lib/utils";

export default function DriveProgressCard({ drive }: { drive: DonationDrive }) {
    const progress = Math.min(100, Math.round((drive.collectedAmount / drive.targetAmount) * 100));

    let progressColor = "bg-primary"; // Default Gold
    if (progress >= 100) progressColor = "bg-primary-green"; // Completed
    else if (progress < 20) progressColor = "bg-red-500"; // Low
    else progressColor = "bg-primary-bronze"; // Mid

    const handleExport = () => {
        const driveDonations = RECENT_DONATIONS.filter((d) => d.driveId === drive.id);
        exportToCSV(driveDonations, `${drive.title.replace(/\s+/g, '_').toLowerCase()}_donations`);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-gray-900">{drive.title}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">
                        {drive.category}
                    </span>
                </div>
                <span className={clsx("text-xs font-bold px-2 py-1 rounded-lg bg-secondary text-primary-bronze")}>
                    {progress}%
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Collected</span>
                    <span className="font-bold text-gray-900">KES {drive.collectedAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={clsx("h-2.5 rounded-full transition-all duration-500", progressColor)} style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Target: KES {drive.targetAmount.toLocaleString()}</span>
                    <span>{drive.donorsCount} Donors</span>
                </div>
            </div>

            <div className="mt-auto flex gap-3 pt-3 border-t border-gray-50">
                <Link
                    href={`/drives/${drive.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-bronze transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    View
                </Link>
                <button
                    onClick={handleExport}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>
        </div>
    );
}
