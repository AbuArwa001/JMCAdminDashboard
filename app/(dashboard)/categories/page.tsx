"use client";

import { useState } from "react";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import StatsHeader from "@/components/dashboard/StatsHeader";
import { exportToCSV } from "@/lib/utils";
import { useCategoriesPage } from "@/hooks/use-categories-page";
import { CategoriesToolbar } from "@/components/categories/CategoriesToolbar";
import { CategoriesTableView } from "@/components/categories/CategoriesTableView";
import { CategoriesGridView } from "@/components/categories/CategoriesGridView";
import { CategoryQuickPerformance } from "@/components/categories/CategoryQuickPerformance";

export default function CategoriesPage() {
  const { categories, isLoading, handleDelete } = useCategoriesPage();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filtered = categories.filter((c) =>
    c.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = categories.reduce((sum, c) => sum + (Number(c.total_amount) || 0), 0);
  const topCategory = categories.reduce(
    (prev, c) => ((Number(c.total_amount) || 0) > prev.value ? { name: c.category_name, value: Number(c.total_amount) || 0 } : prev),
    { name: "N/A", value: 0 }
  );

  const handleExport = () => {
    exportToCSV(
      filtered.map((c) => ({
        "Category Name": c.category_name,
        Colour: c.color,
        "Total Collected": c.total_amount || 0,
      })),
      "categories_report"
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Fund Categories</h1>
        <p className="text-xs text-gray-500 mt-1">Configure and manage donation classifications</p>
      </div>

      <StatsHeader
        totalCategories={categories.length}
        topCategory={topCategory}
        totalAmount={totalAmount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryPieChart data={categories} isLoading={isLoading} />
        </div>
        <div>
          <CategoryQuickPerformance categories={categories} isLoading={isLoading} />
        </div>
      </div>

      <CategoriesToolbar
        searchTerm={searchTerm}
        viewMode={viewMode}
        onSearchChange={setSearchTerm}
        onViewModeChange={setViewMode}
        onExport={handleExport}
      />

      {isLoading ? (
        <div className="py-12 text-center text-gray-400 text-xs">Loading categories...</div>
      ) : viewMode === "table" ? (
        <CategoriesTableView categories={filtered} onDelete={handleDelete} />
      ) : (
        <CategoriesGridView categories={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
}
