"use client";

import { CheckCheck, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  activeCount: number;
  unreadCount: number;
  dismissedCount: number;
  onMarkAllRead: () => void;
  onRestore: () => void;
  onClearAll: () => void;
}

export function NotificationFeedOverview({
  activeCount, unreadCount, dismissedCount, onMarkAllRead, onRestore, onClearAll
}: Props) {
  return (
    <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Personal Feed Status</h4>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
          <span><strong className="text-gray-900 font-bold">{activeCount}</strong> active alerts</span>
          <span>&bull;</span>
          <span><strong className="text-[#c99335] font-bold">{unreadCount}</strong> unread</span>
          <span>&bull;</span>
          <span><strong className="text-gray-900 font-bold">{dismissedCount}</strong> dismissed</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {unreadCount > 0 && (
          <button type="button" onClick={() => { onMarkAllRead(); toast.success("All marked read"); }} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
            <CheckCheck className="w-3.5 h-3.5 text-[#006838]" />
            <span>Mark All Read</span>
          </button>
        )}
        {dismissedCount > 0 && (
          <button type="button" onClick={() => { onRestore(); toast.success("Dismissed restored"); }} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-[#c99335]" />
            <span>Restore ({dismissedCount})</span>
          </button>
        )}
        {activeCount > 0 && (
          <button type="button" onClick={() => { onClearAll(); toast.info("Cleared all alerts"); }} className="btn-outline text-xs py-1.5 px-3 text-red-600 hover:bg-red-50 flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Clear All</span>
          </button>
        )}
      </div>
    </div>
  );
}

