"use client";

import { useState, useEffect } from "react";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import { Download, Filter } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DonationsPage() {
    const [donations, setDonations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await api.get("/api/v1/transactions/");
                const mappedDonations = response.data.results.map((t: any) => ({
                    id: t.id,
                    donorName: t.user ? `User ${t.user}` : "Anonymous",
                    amount: t.amount,
                    category: "General",
                    paymentMethod: t.payment_method,
                    status: t.status,
                    date: t.transaction_date,
                }));
                setDonations(mappedDonations);
            } catch (error) {
                console.error("Error fetching donations:", error);
                toast.error("Failed to load donations");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const handleExport = () => {
        exportToCSV(donations, "donations_report");
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

            <RecentDonationsTable donations={donations} />
        </div>
    );
}
