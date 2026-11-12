import { Bell } from "lucide-react";

export function SettingsNotificationsTab() {
  return (
    <>
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
          <Bell className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Notification Preferences</h3>
          <p className="text-[11px] text-gray-400">Control alerts and system notifications</p>
        </div>
      </div>
      <div className="form-section-body text-center py-16">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-7 h-7 text-gray-300" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">You&apos;re all caught up!</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">Notification preferences are active with Firebase Cloud Messaging (FCM).</p>
      </div>
    </>
  );
}
