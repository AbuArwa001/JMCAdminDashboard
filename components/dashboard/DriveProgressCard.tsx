import { DonationDrive } from "@/lib/data";
import clsx from "clsx";

export default function DriveProgressCard({ drive }: { drive: DonationDrive }) {
    const progress = Math.min(100, Math.round((drive.collectedAmount / drive.targetAmount) * 100));

    let progressColor = "bg-primary"; // Default Gold
    if (progress >= 100) progressColor = "bg-primary-green"; // Completed
    else if (progress < 20) progressColor = "bg-red-500"; // Low
    else progressColor = "bg-primary-bronze"; // Mid

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-bold text-gray-900">{drive.title}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block">
                        {drive.category}
                    </span>
                </div>
                <span className={clsx("text-xs font-bold px-2 py-1 rounded-full",
                    progress >= 100 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}>
                    {progress}%
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Collected</span>
                    <span className="font-bold text-gray-900">KES {drive.collectedAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={clsx("h-2.5 rounded-full transition-all duration-500", progressColor)}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Target: KES {drive.targetAmount.toLocaleString()}</span>
                    <span>{drive.donorsCount} Donors</span>
                </div>
            </div>
        </div>
    );
}
