"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";
import { useAdminNotifications } from "@/hooks/use-admin-notifications";
import { NotificationFeedOverview } from "./NotificationFeedOverview";
import { NotificationCategoryToggles } from "./NotificationCategoryToggles";
import { BrowserPushCard } from "./BrowserPushCard";

export function SettingsNotificationsTab() {
  const {
    notifications, unreadCount, dismissedCount, preferences, updatePreferences,
    markAllAsRead, clearAllNotifications, restoreDismissed,
  } = useAdminNotifications();

  const handleToggle = (key: any, value: any) => {
    updatePreferences({ [key]: value });
    toast.success("Preferences updated");
  };

  return (
    <div className="space-y-6">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
          <Bell className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide text-gray-900" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Notification Preferences &amp; Feed Management
          </h3>
          <p className="text-[11px] text-gray-400">Control alert categories, thresholds, and your notification history</p>
        </div>
      </div>

      <div className="form-section-body space-y-6">
        <NotificationFeedOverview
          activeCount={notifications.length} unreadCount={unreadCount} dismissedCount={dismissedCount}
          onMarkAllRead={markAllAsRead} onRestore={restoreDismissed} onClearAll={clearAllNotifications}
        />
        <NotificationCategoryToggles preferences={preferences} onToggle={handleToggle} />
        <BrowserPushCard />
      </div>
    </div>
  );
}
