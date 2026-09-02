"use client";

import { DonationDrive } from "@/lib/data";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import { Download, Plus, Search, Filter, Heart } from "lucide-react";

import { exportToCSV } from "@/lib/utils";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDonationDrives, getCategories } from "@/lib/api_data";

export default function DrivesPage() {
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchDrives = async () => {
    try {
      setIsLoading(true);
      const [rawDrives, categoriesRes] = await Promise.all([
        getDonationDrives(),
        getCategories(),
      ]);

      const categoryMap = categoriesRes.reduce((acc: any, cat: any) => {
        acc[cat.id] = cat.category_name;
        return acc;
      }, {});

      const mappedDrives = rawDrives.map((drive) => ({
        ...drive,
        categoryName: categoryMap[drive.category] || "General",
      }));

      setDrives(mappedDrives);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const filteredDrives = drives.filter((drive) => {
    const matchesSearch = drive.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || drive.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDrives.length / itemsPerPage);
  const paginatedDrives = filteredDrives.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleExport = () => {
    exportToCSV(filteredDrives, "donation_drives");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-[#c99335]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              Donation Drives
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Manage active fundraising campaigns and track progress.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-grow md:flex-grow-0 group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006838] transition-colors" />
            <input
              type="text"
              placeholder="Search drives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006838]/20 w-full md:w-60 transition-all font-medium"
            />
          </div>

          <div className="relative group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006838]/20 cursor-pointer hover:bg-gray-100 transition-all font-medium text-gray-700"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="h-8 self-center w-px bg-gray-200 hidden md:block" />

          <button
            onClick={handleExport}
            className="btn-secondary text-xs py-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/drives/create"
            className="btn-primary text-xs py-2"
          >
            <Plus className="w-4 h-4" />
            New Drive
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <DriveProgressCard key={i} isLoading={true} />
          ))
        ) : paginatedDrives.length > 0 ? (
          paginatedDrives.map((drive) => (
            <DriveProgressCard
              key={drive.id}
              drive={drive}
              onUpdate={fetchDrives}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">No drives found</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 font-medium">
            Page <span className="text-gray-900">{currentPage}</span> of{" "}
            <span className="text-gray-900">{totalPages}</span>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
