"use client";

import { DollarSign, Radio, FileText, HeartHandshake, Calendar } from "lucide-react";
import { UserNotificationPreferences } from "@/lib/notification-types";

interface Props {
  preferences: UserNotificationPreferences;
  onToggle: (key: keyof UserNotificationPreferences, value: any) => void;
}

export function NotificationCategoryToggles({ preferences, onToggle }: Props) {
  const switchClass = "w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006838]";

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Alert Categories</h4>
      <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006838] flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>
            <div>
              <p className="text-xs font-bold text-gray-900">Donations &amp; Treasury</p>
              <p className="text-[11px] text-gray-500">Alerts when new donations arrive into Jamia accounts</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={preferences.donations} onChange={(e) => onToggle("donations", e.target.checked)} className="sr-only peer" />
            <div className={switchClass} />
          </label>
        </div>
        {preferences.donations && (
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-500">Min Amount:</span>
            <select value={preferences.donationMinAmount} onChange={(e) => onToggle("donationMinAmount", Number(e.target.value))} className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-700">
              <option value={0}>All Donations</option>
              <option value={1000}>KES 1,000+</option>
              <option value={5000}>KES 5,000+</option>
              <option value={10000}>KES 10,000+ (Default)</option>
              <option value={50000}>KES 50,000+</option>
            </select>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#c99335] flex items-center justify-center"><Radio className="w-4 h-4" /></div>
          <div><p className="text-xs font-bold text-gray-900">Friday Khutba</p><p className="text-[11px] text-gray-500">Weekly titles, speakers and recordings</p></div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={preferences.khutba} onChange={(e) => onToggle("khutba", e.target.checked)} className="sr-only peer" />
          <div className={switchClass} />
        </label>
      </div>

      <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
          <div><p className="text-xs font-bold text-gray-900">Friday Bulletins</p><p className="text-[11px] text-gray-500">Weekly publications &amp; announcements</p></div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={preferences.bulletins} onChange={(e) => onToggle("bulletins", e.target.checked)} className="sr-only peer" />
          <div className={switchClass} />
        </label>
      </div>

      <div className="p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><HeartHandshake className="w-4 h-4" /></div>
          <div><p className="text-xs font-bold text-gray-900">Donation Drives</p><p className="text-[11px] text-gray-500">Campaigns and target milestone alerts</p></div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={preferences.drives} onChange={(e) => onToggle("drives", e.target.checked)} className="sr-only peer" />
          <div className={switchClass} />
        </label>
      </div>
    </div>
  );
}

