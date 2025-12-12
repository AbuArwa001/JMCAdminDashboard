"use client";

import { useState, useEffect } from "react";
import RecentDonationsTable from "@/components/dashboard/RecentDonationsTable";
import { Download, Filter } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import { Donation, Transaction, CategoryData } from "@/lib/data";

// interface TransactionResponse {
//     id: string;
//     user?: User;
//     amount: number;
//     category?: string;
//     payment_method: string;
//     status: string;
//     date: string;
// }

export default function DonationsPage() {
    const [donations, setDonations] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
                const getUser = async (userId: string) => {
                    try {
                        const userRes = await api.get(`/api/v1/users/${userId}/`);
                        return userRes.data;
                    } catch (err) {
                        console.log(`Failed to fetch user with ID: ${userId}`);
                        return { id: userId, fullName: "Anonymous" };
                    }
                };
                // Create a map of category ID to category name
                const categoryMap: Record<string, string> = {};
                categoryResponses.forEach((response, index) => {
                    const categoryId = categoryIds[index];
                    // console.log(`Mapping category ID ${categoryId} to name:`, transactions.donation.category_name);
                    if (response.data?.category_name) {
                        categoryMap[categoryId] = response.data.category_name;
                    }
                });
                
                // Map transactions with category names
                const mappedDonations = transactions.map((transaction: Transaction): Transaction => ({
                    ...transaction,
                    category: categoryMap[transaction.donation.category] || "General",
                    user_name: transaction.user?.full_name
                    // Add any other required properties from your Transaction type
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

            {isLoading ? (
                <div className="text-center py-8">Loading donations...</div>
            ) : (
                <RecentDonationsTable transactions={donations} />
            )}
        </div>
    );
}