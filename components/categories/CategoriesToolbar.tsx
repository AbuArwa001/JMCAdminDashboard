import { Search, Plus, LayoutGrid, List as ListIcon, Download } from "lucide-react";
import Link from "next/link";

interface Props {
  searchTerm: string;
  viewMode: "table" | "grid";
  onSearchChange: (v: string) => void;
  onViewModeChange: (m: "table" | "grid") => void;
  onExport: () => void;
}

export function CategoriesToolbar({ searchTerm, viewMode, onSearchChange, onViewModeChange, onExport }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input pl-9 py-2 text-xs w-full"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <button onClick={() => onViewModeChange("table")} className={`p-1.5 rounded-lg ${viewMode === "table" ? "bg-white shadow-sm" : "text-gray-500"}`}>
            <ListIcon className="w-4 h-4" />
          </button>
          <button onClick={() => onViewModeChange("grid")} className={`p-1.5 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onExport} className="btn-secondary py-2 text-xs flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
        <Link href="/categories/create" className="btn-primary py-2 text-xs flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> New Category
        </Link>
      </div>
    </div>
  );
}

