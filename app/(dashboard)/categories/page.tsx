"use client";
import { useState, useEffect } from "react";
import { CategoryData } from "@/lib/data";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import { Download, Plus, Pencil, Trash2, Search } from "lucide-react";
import { exportToCSV, getFallbackColor } from "@/lib/utils";
import Link from "next/link";

import { toast } from "sonner";
import { getAnalyticsCategories, getCategories, deleteCategory } from "@/lib/api_data";
import { AnalyticsCategory, CategoryData } from "@/lib/data";

export default function CategoriesPage() {
  const [stats, setStats] = useState<CategoryData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const chartData = stats.map((category) => {
    let totalAmount = 0;
    if (category.total_amount !== undefined) {
      totalAmount = category.total_amount;
    } else if (Array.isArray(category.donations)) {
      totalAmount = category.donations.reduce(
        (sum: any, donation: { collected_amount: any }) =>
          sum + (donation.collected_amount || 0),
        0,
      );
    }

    return {
      name: category.category_name,
      value: totalAmount,
      color: category.color,
    };
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Just fetch these two
      const [statsRes, categoriesRes] = await Promise.all([
        getAnalyticsCategories(),
        getCategories(),
      ]);

      const categoriesData = Array.isArray(categoriesRes) ? categoriesRes : [];

      // statsRes likely already contains the total_amount for each category
      setStats(statsRes);
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleExport = () => {
    exportToCSV(stats.length > 0 ? stats : [], "category_performance");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <Link
            href="/categories/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze whitespace-nowrap"
          >
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
            {chartData.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                </div>
                <span className="font-bold text-gray-900">
                  KES {cat.value?.toLocaleString()}
                </span>
              </div>
            ))}
            {stats.length === 0 && !isLoading && (
              <p className="text-gray-500 text-center py-4">
                No data available
              </p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.created_at
                      ? new Date(category.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/categories/${category.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => category.id && handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCategories.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
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
