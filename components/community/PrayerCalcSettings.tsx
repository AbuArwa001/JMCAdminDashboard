import api from "@/lib/api";

const METHODS = [
  "MUSLIM_WORLD_LEAGUE", "ISLAMIC_SOCIETY_OF_NORTH_AMERICA", "EGYPTIAN",
  "UMM_AL_QURA", "KARACHI", "TEHRAN", "SHIA"
];

interface Props {
  settings: { calculation_method: string };
  onSettingsChange: (s: { calculation_method: string }) => void;
  onRefreshPreview: () => void;
}

export function PrayerCalcSettings({ settings, onSettingsChange, onRefreshPreview }: Props) {
  const saveSettings = async () => {
    try {
      await api.put("/api/v1/prayer-times/settings/", settings);
      alert("Settings saved successfully.");
      onRefreshPreview();
    } catch { alert("Failed to save settings."); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-4">Calculation Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
          <select className="w-full p-2 border rounded focus:ring-amber-500" value={settings.calculation_method} onChange={(e) => onSettingsChange({ ...settings, calculation_method: e.target.value })}>
            {METHODS.map((m) => (<option key={m} value={m}>{m.replace(/_/g, " ")}</option>))}
          </select>
        </div>
        <button onClick={saveSettings} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition">
          Save Method
        </button>
      </div>
    </div>
  );
}
