"use client";

import { CATEGORY_STATS } from "@/lib/data";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import { Download } from "lucide-react";

import { exportToCSV } from "@/lib/utils";

export default function CategoriesPage() {
    const handleExport = () => {
        exportToCSV(CATEGORY_STATS, "category_performance");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryPieChart />

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Category Performance</h3>
                    <div className="space-y-4">
                        {CATEGORY_STATS.map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    <span className="font-medium text-gray-900">{cat.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
