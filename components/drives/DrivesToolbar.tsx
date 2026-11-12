import { Search, Filter, Download, Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onExport: () => void;
}

export function DrivesToolbar({ searchTerm, statusFilter, onSearchChange, onStatusChange, onExport }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative group flex-grow md:flex-grow-0">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search drives..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
        />
      </div>

      <div className="relative group">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
          <option value="Completed">Completed</option>
        </select>
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <button onClick={onExport} className="btn-secondary py-2.5 px-3 text-sm flex items-center gap-1.5">
        <Download className="w-4 h-4" /> Export
      </button>

      <Link href="/drives/create" className="btn-primary py-2.5 px-4 text-sm flex items-center gap-1.5">
        <Plus className="w-4 h-4" /> New Drive
      </Link>
    </div>
  );
}
