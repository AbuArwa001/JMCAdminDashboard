"use client";

import { CheckCheck, Trash2, Settings, RotateCcw } from "lucide-react";
import Link from "next/link";

interface Props {
  unreadCount: number;
  totalCount: number;
  dismissedCount: number;
  filter: "all" | "unread";
  onFilterChange: (f: "all" | "unread") => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onRestore: () => void;
  onClose: () => void;
}

export function NotificationsDropdownHeader({
  unreadCount, totalCount, dismissedCount, filter,
  onFilterChange, onMarkAllRead, onClearAll, onRestore, onClose,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-sm text-gray-900">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#c99335] text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="text-xs font-semibold text-[#006838] hover:text-[#004d29] flex items-center gap-1 hover:underline">
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          {totalCount > 0 && (
            <button onClick={onClearAll} title="Clear all" className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <Link href="/settings?tab=notifications" onClick={onClose} title="Settings" className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-white text-xs">
        <div className="flex items-center gap-1.5">
          <button onClick={() => onFilterChange("all")} className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filter === "all" ? "bg-[#1a1512] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
            All ({totalCount})
          </button>
          <button onClick={() => onFilterChange("unread")} className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${filter === "unread" ? "bg-[#1a1512] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}>
            Unread ({unreadCount})
          </button>
        </div>
        {dismissedCount > 0 && (
          <button onClick={onRestore} className="text-[11px] text-gray-400 hover:text-[#c99335] flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            <span>Restore ({dismissedCount})</span>
          </button>
        )}
      </div>
    </>
  );
}

