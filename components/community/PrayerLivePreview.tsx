import { Eye } from "lucide-react";

const PRAYERS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

interface Props {
  cities: any[];
  previewCityId: number | "";
  previewDate: string;
  previewData: any;
  onCityChange: (id: number) => void;
  onDateChange: (d: string) => void;
  onLoad: () => void;
}

export function PrayerLivePreview({
  cities, previewCityId, previewDate, previewData, onCityChange, onDateChange, onLoad
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 bg-slate-50">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5" /> Live Preview</h2>
      <div className="flex gap-4 mb-4">
        <select className="flex-1 p-2 border rounded focus:ring-amber-500" value={previewCityId} onChange={(e) => onCityChange(Number(e.target.value))}>
          <option value="">Select City...</option>
          {cities.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <input type="date" className="flex-1 p-2 border rounded focus:ring-amber-500" value={previewDate} onChange={(e) => onDateChange(e.target.value)} />
        <button onClick={onLoad} className="px-4 py-2 bg-gray-900 text-white rounded font-medium hover:bg-gray-800">Load</button>
      </div>
      {previewData ? (
        <div className="grid grid-cols-3 gap-4">
          {PRAYERS.map((p) => (
            <div key={p} className="bg-white p-3 rounded shadow-sm border border-gray-200 text-center">
              <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{p}</div>
              <div className="text-lg font-bold text-gray-900 mt-1">{previewData[p] || "--:--"}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">Select a city and date to preview calculated times.</div>
      )}
    </div>
  );
}
