import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function RecentDonationsPagination({ currentPage, totalPages, totalItems, startIndex, itemsPerPage, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
      <div>
        Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to{" "}
        <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
        <span className="font-bold text-slate-900">{totalItems}</span> transactions
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 font-bold text-slate-800">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
