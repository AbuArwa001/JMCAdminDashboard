import { Search, Filter, Download } from "lucide-react";

interface Props {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onExport: () => void;
}

export function DonationsToolbar({ searchTerm, statusFilter, onSearchChange, onStatusChange, onExport }: Props) {
  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto bg-white p-2 rounded-2xl shadow-sm border border-gray-100/50">
      <div className="relative flex-grow md:flex-grow-0 group">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search donations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
        />
      </div>

      <div className="relative group">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none pl-10 pr-8 py-2.5 bg-gray-50 border-0 rounded-xl text-sm font-medium text-gray-700 cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <button onClick={onExport} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 font-medium rounded-xl hover:bg-gray-100 text-sm">
        <Download className="w-4 h-4" /> Export
      </button>
    </div>
  );
}
