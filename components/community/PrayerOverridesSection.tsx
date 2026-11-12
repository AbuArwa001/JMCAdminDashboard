import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash, X } from "lucide-react";
import api from "@/lib/api";

const PRAYERS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

interface Props {
  cities: any[];
  overrides: any[];
  onRefresh: () => void;
  onDelete: (id: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

export function PrayerOverridesSection({
  cities, overrides, onRefresh, onDelete, isSubmitting, setIsSubmitting
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ city: 0, date: format(new Date(), "yyyy-MM-dd"), prayer_name: "fajr", overridden_time: "05:00", reason: "" });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/v1/prayer-times/overrides/", form);
      setShowForm(false);
      onRefresh();
    } catch { alert("Failed to save override."); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manual Overrides</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm"><Plus className="w-4 h-4" /> Add Override</button>
      </div>
      {showForm && (
        <form onSubmit={handleSave} className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-lg space-y-4 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium mb-1">City</label><select required className="w-full p-2 border rounded" value={form.city} onChange={(e) => setForm({ ...form, city: Number(e.target.value) })}><option value={0}>Select City</option>{cities.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
            <div><label className="block text-xs font-medium mb-1">Date</label><input required type="date" className="w-full p-2 border rounded" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><label className="block text-xs font-medium mb-1">Prayer</label><select required className="w-full p-2 border rounded" value={form.prayer_name} onChange={(e) => setForm({ ...form, prayer_name: e.target.value })}>{PRAYERS.map((p) => (<option key={p} value={p}>{p}</option>))}</select></div>
            <div><label className="block text-xs font-medium mb-1">Time</label><input required type="time" step="1" className="w-full p-2 border rounded" value={form.overridden_time} onChange={(e) => setForm({ ...form, overridden_time: e.target.value })} /></div>
            <div className="col-span-2"><label className="block text-xs font-medium mb-1">Reason</label><input required type="text" className="w-full p-2 border rounded" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 font-medium" disabled={isSubmitting}>Cancel</button><button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white rounded font-medium px-4 py-2">Save</button></div>
        </form>
      )}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <tbody className="bg-white divide-y divide-gray-200">
            {overrides.map((ov) => (
              <tr key={ov.id}>
                <td className="px-3 py-2 text-sm"><div className="font-medium text-gray-900">{cities.find((c) => c.id === ov.city)?.name || ov.city} - {ov.date}</div><div className="text-gray-500">{ov.prayer_name}: <span className="font-bold text-amber-600">{ov.overridden_time}</span></div></td>
                <td className="px-3 py-2 text-sm text-gray-500">{ov.reason}</td>
                <td className="px-3 py-2 text-sm text-right"><button onClick={() => onDelete(ov.id)} className="text-red-500 hover:text-red-700"><Trash className="w-4 h-4" /></button></td>
              </tr>
            ))}
            {overrides.length === 0 && (<tr><td colSpan={3} className="px-3 py-4 text-center text-sm text-gray-500">No overrides set.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

