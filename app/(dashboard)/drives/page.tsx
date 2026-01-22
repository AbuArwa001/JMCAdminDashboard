"use client";

import { DonationDrive } from "@/lib/data";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import { Download, Plus, Search, Filter } from "lucide-react";

import { exportToCSV } from "@/lib/utils";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get } from "http";
import { getDonationDrives } from "@/lib/api_data";

export default function DrivesPage() {
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrives = async () => {
    try {
      setIsLoading(true);
      const drives = await getDonationDrives();
      setDrives(drives);
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

  const handleExport = () => {
    exportToCSV(filteredDrives, "donation_drives");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Donation Drives</h1>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drives..."
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
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
              <option value="Mid-progress">Mid-progress</option>
              <option value="Low-progress">Low-progress</option>
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
          <Link
            href="/drives/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Drive
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <DriveProgressCard key={i} isLoading={true} />
          ))
        ) : (
          filteredDrives.map((drive) => (
            <DriveProgressCard
              key={drive.id}
              drive={drive}
              onUpdate={fetchDrives}
            />
          ))
        )}
      </div>
    </div>
  );
}
