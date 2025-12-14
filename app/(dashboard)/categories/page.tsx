"use client"
import { useState, useEffect } from "react";
import { CategoryData, CategoryStat } from "@/lib/data";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import { Download, Plus, Pencil, Trash2 } from "lucide-react";
import { exportToCSV, getFallbackColor } from "@/lib/utils";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";


interface AnalyticsCategory {
    category_name: string;
    total_amount: number;
}

interface ApiCategory {
    id: string;
    category_name: string;
    color: string;
    created_at: string;
    donations: any[];
}

export default function CategoriesPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, categoriesRes] = await Promise.all([
                api.get<AnalyticsCategory[]>("/api/v1/analytics/categories/"),
                api.get<{ results: ApiCategory[] }>("/api/v1/categories/")
            ]);
            const categoriesData = Array.isArray(categoriesRes.data)
                ? categoriesRes.data
                : categoriesRes.data.results || [];
            // Create color mapping from categories
            const colorMap = categoriesData.reduce((acc: Record<string, string>, category: ApiCategory) => {
                acc[category.category_name] = category.color;
                return acc;
            }, {});
            const mappedCategories = categoriesData.map((cat: ApiCategory, index: number) => ({
                id: cat.id,
                name: cat.category_name,
                color: cat.color || getFallbackColor(index),
                createdAt: cat.created_at,
                donations: cat.donations,
            }));
            // Map stats with proper colors
            const mappedStats: CategoryStat[] = statsRes.data.map((cat: AnalyticsCategory, index: number) => {
                const categoryColor = colorMap[cat.category_name] || getFallbackColor(index);

                return {
                    name: cat.category_name,
                    value: Number(cat.total_amount), // Ensure it's a number
                    color: categoryColor,
                };
            });
            setStats(mappedStats);
            // Handle both paginated and non-paginated responses
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/api/v1/categories/${id}/`);
            toast.success("Category deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete category");
        }
    };

    const handleExport = () => {
        exportToCSV(stats.length > 0 ? stats : [], "category_performance");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <Link href="/categories/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze">
                        <Plus className="w-4 h-4" />
                        New Category
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryPieChart data={stats} />

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Category Performance</h3>
                    <div className="space-y-4">
                        {stats.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    <span className="font-medium text-gray-900">{cat.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">KES {cat.value?.toLocaleString()}</span>
                            </div>
                        ))}
                        {stats.length === 0 && !isLoading && (
                            <p className="text-gray-500 text-center py-4">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Categories Management Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">All Categories</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {category.category_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                                        {category.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/categories/${category.id}/edit`} className="text-blue-600 hover:text-blue-900">
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
