"use client";

import { useState, useEffect } from "react";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import { Download, Filter, Search } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import { Donation, Transaction, CategoryData } from "@/lib/data";
import { useSearchParams } from "next/navigation";

export default function DonationsPage() {
    const [donations, setDonations] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const searchParams = useSearchParams();

    useEffect(() => {
        const querySearch = searchParams.get("search");
        if (querySearch) {
            setSearchTerm(querySearch);
        }
    }, [searchParams]);

    const filteredDonations = donations.filter(donation => {
        const matchesSearch =
            donation.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.amount.toString().includes(searchTerm) ||
            donation.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.category?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || donation.payment_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const exportData = filteredDonations.map(item => ({
        "Full Name": item.user_name,
        donation_title: item.donation?.title,
        amount: item.amount,
        donated_at: item.donated_at,
        payment_method: item.payment_method,
        payment_status: item.payment_status,
        category: item.category,
    }));

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await api.get("/api/v1/transactions/");

                // Fetch categories in parallel for better performance
                const transactions = response.data.results as Transaction[];
                // Create a set of unique category IDs to fetch
                const categoryIds = [...new Set(transactions
                    .map((transaction: Transaction) => transaction.donation.category)
                    .filter((id): id is string => id !== undefined && id !== null)
                )];
                // Fetch all categories at once
                const categoryPromises = categoryIds.map(async (id) => {
                    try {
                        return await api.get(`/api/v1/categories/${id}/`);
                    } catch (err) {
                        console.log(`Failed to fetch category with ID: ${id}`);
                        return { data: { id, category_name: "General" } };
                    }
                });


                const categoryResponses = await Promise.all(categoryPromises);

                // Create a map of category ID to category name
                const categoryMap: Record<string, string> = {};
                categoryResponses.forEach((response, index) => {
                    const categoryId = categoryIds[index];
                    if (response.data?.category_name) {
                        categoryMap[categoryId] = response.data.category_name;
                    }
                });

                // Map transactions with category names
                const mappedDonations = transactions.map((transaction: Transaction): Transaction => ({
                    ...transaction,
                    category: categoryMap[transaction.donation.category] || "General",
                    user_name: transaction.user?.full_name || "Anonymous"
                }));

                setDonations(mappedDonations);
            } catch (error) {
                toast.error("Failed to load donations");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const handleExport = () => {
        exportToCSV(exportData, "donations_report");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search donations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>
                        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading donations...</div>
            ) : (
                <RecentDonationsTable transactions={filteredDonations} />
            )}
        </div>
    );
}