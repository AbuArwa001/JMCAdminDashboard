"use client";

import { useEffect, useState } from "react";
import { DonationDrive } from "@/lib/data";
import { getDonationDrives, getCategories } from "@/lib/api_data";
import { exportToCSV } from "@/lib/utils";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import { DrivesToolbar } from "@/components/drives/DrivesToolbar";

export default function DrivesPage() {
  const [drives, setDrives] = useState<DonationDrive[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrives = async () => {
    try {
      setIsLoading(true);
      const [rawDrives, cats] = await Promise.all([getDonationDrives(), getCategories()]);
      const catMap = (cats || []).reduce((acc: any, c: any) => ({ ...acc, [c.id]: c.category_name }), {});
      setDrives((rawDrives || []).map((d) => ({ ...d, categoryName: catMap[d.category] || "General" })));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDrives(); }, []);

  const filtered = drives.filter((d) => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    exportToCSV(
      filtered.map((d) => ({ Title: d.title, Category: d.category, Target: d.target_amount, Raised: d.collected_amount, Status: d.status })),
      "donation_drives"
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Donation Drives</h1>
          <p className="text-sm text-gray-500 mt-1">Manage fundraising initiatives, targets, and live progress.</p>
        </div>
        <DrivesToolbar searchTerm={searchTerm} statusFilter={statusFilter} onSearchChange={setSearchTerm} onStatusChange={setStatusFilter} onExport={handleExport} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <DriveProgressCard key={i} isLoading={true} />)
        ) : filtered.length > 0 ? (
          filtered.map((drive) => <DriveProgressCard key={drive.id} drive={drive} onUpdate={fetchDrives} />)
        ) : (
          <div className="col-span-full py-16 text-center text-gray-400 text-sm">No donation drives found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}
