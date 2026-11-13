"use client";

import { Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { EnrichedNotificationLog } from "@/lib/notification-types";
import { NotifIcon } from "./NotifIcon";

interface Props {
  notif: EnrichedNotificationLog;
  onMarkRead: (id: number) => void;
  onToggleRead: (id: number, isRead: boolean) => void;
  onDismiss: (id: number) => void;
}

export function NotificationsDropdownItem({ notif, onMarkRead, onToggleRead, onDismiss }: Props) {
  return (
    <div
      onClick={() => onMarkRead(notif.id)}
      className={`group relative flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
        notif.isRead ? "bg-white hover:bg-gray-50/80" : "bg-[#c99335]/[0.04] hover:bg-[#c99335]/[0.08]"
      }`}
    >
      {!notif.isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#c99335]" title="Unread" />
      )}
      <div className="mt-0.5">
        <NotifIcon type={notif.notification_type} />
      </div>
      <div className="flex-1 min-w-0 pr-12">
        <p className={`text-xs truncate ${notif.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
          {notif.title}
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{notif.body}</p>
        <span className="text-[10px] text-gray-400 mt-1 block">
          {formatDistanceToNow(new Date(notif.sent_at), { addSuffix: true })}
        </span>
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleRead(notif.id, notif.isRead); }}
          title={notif.isRead ? "Mark unread" : "Mark read"}
          className="p-1 rounded-md text-gray-400 hover:text-[#006838] hover:bg-emerald-50 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDismiss(notif.id); }}
          title="Dismiss notification"
          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

