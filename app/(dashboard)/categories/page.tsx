"use client";
import { useState, useEffect } from "react";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import StatsHeader from "@/components/dashboard/StatsHeader";
import {
  Download,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";
import {
  getAnalyticsCategories,
  getCategories,
  deleteCategory,
} from "@/lib/api_data";
import { CategoryData } from "@/lib/data";

import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoriesPage() {
  const [stats, setStats] = useState<CategoryData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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

  const totalDonations = chartData.reduce(
    (sum, cat) => sum + (cat.value || 0),
    0,
  );
  const topCategory = chartData.reduce(
    (prev, current) => (prev.value > current.value ? prev : current),
    { name: "", value: 0 },
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, categoriesRes] = await Promise.all([
        getAnalyticsCategories(),
        getCategories(),
      ]);

      setStats(Array.isArray(statsRes) ? statsRes : []);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
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
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Management Categories
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Overview and performance of your donation categories.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-sm hover:bg-gray-50 transition-all text-sm"
          >
            <Download className="w-4.5 h-4.5" />
            Export Data
          </button>
          <Link
            href="/categories/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-md shadow-primary/20 hover:bg-primary-bronze transition-all text-sm"
          >
            <Plus className="w-4.5 h-4.5" />
            Add Category
          </Link>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <StatsHeader
        totalCategories={categories.length}
        topCategory={topCategory}
        totalAmount={totalDonations}
      />

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CategoryPieChart data={stats} isLoading={isLoading} />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-900 text-lg">
              Quick Performance
            </h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Live
            </span>
          </div>

          <div className="space-y-6 flex-grow">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))
              : chartData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="text-sm font-bold text-gray-700">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-sm font-black text-gray-900">
                          {((cat.value / totalDonations) * 100 || 0).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(cat.value / totalDonations) * 100 || 0}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  ))}
            {!isLoading && stats.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                  <LayoutGrid className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium italic">
                  No performance data yet
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Categories Management Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-7 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/5 rounded-lg">
              <ListIcon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg underline decoration-primary/20 underline-offset-8">
              All Categories
            </h3>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-80 transition-all"
              />
            </div>
            <button className="p-2.5 border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Category Details
                </th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Created Date
                </th>
                <th className="px-8 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-8 py-6">
                          <Skeleton className="h-10 w-64 rounded-xl" />
                        </td>
                        <td className="px-8 py-6">
                          <Skeleton className="h-5 w-24 rounded-lg" />
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Skeleton className="h-10 w-24 ml-auto rounded-xl" />
                        </td>
                      </tr>
                    ))
                  : filteredCategories.map((category, index) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-1.5 h-10 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {category.category_name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-sm">
                                {category.description ||
                                  "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-medium text-gray-500 bg-gray-100/50 px-3 py-1 rounded-full">
                            {category.created_at
                              ? new Date(
                                  category.created_at,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Not set"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/categories/${category.id}/edit`}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
                              title="Edit Category"
                            >
                              <Pencil className="w-4.5 h-4.5" />
                            </Link>
                            <button
                              onClick={() =>
                                category.id && handleDelete(category.id)
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                              title="Delete Category"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
              </AnimatePresence>
              {filteredCategories.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-bold text-lg italic">
                        No categories matching your search
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-4 text-primary font-bold hover:underline"
                      >
                        Clear search filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-7 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest">
          <span>Showing {filteredCategories.length} results</span>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-primary transition-colors">
              Previous
            </span>
            <span className="cursor-pointer hover:text-primary transition-colors">
              Next
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
