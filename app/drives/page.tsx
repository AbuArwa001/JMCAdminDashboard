"use client";

import { ACTIVE_DRIVES } from "@/lib/data";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import { Download, Plus } from "lucide-react";

import { exportToCSV } from "@/lib/utils";

import Link from "next/link";

export default function DrivesPage() {
    const handleExport = () => {
        exportToCSV(ACTIVE_DRIVES, "donation_drives");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Donation Drives</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                    <Link href="/drives/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze">
                        <Plus className="w-4 h-4" />
                        New Drive
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ACTIVE_DRIVES.map((drive) => (
                    <DriveProgressCard key={drive.id} drive={drive} />
                ))}
            </div>
        </div>
    );
}
