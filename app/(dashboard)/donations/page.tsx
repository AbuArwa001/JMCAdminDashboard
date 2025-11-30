"use client";

import { RECENT_DONATIONS } from "@/lib/data";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import { Download, Filter } from "lucide-react";

import { exportToCSV } from "@/lib/utils";

export default function DonationsPage() {
    const handleExport = () => {
        exportToCSV(RECENT_DONATIONS, "donations_report");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                </div>
            </div>

            <RecentDonationsTable />
        </div>
    );
}
