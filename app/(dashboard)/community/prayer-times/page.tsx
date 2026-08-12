"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { format } from "date-fns";
import { Plus, Trash, Eye, X } from "lucide-react";

interface City {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  is_active: boolean;
}

interface CalcSettings {
  id?: number;
  calculation_method: string;
}

interface Override {
  id: number;
  city: number;
  city_name?: string;
  date: string;
  prayer_name: string;
  overridden_time: string;
  reason: string;
}

const METHODS = [
  "MUSLIM_WORLD_LEAGUE",
  "ISLAMIC_SOCIETY_OF_NORTH_AMERICA",
  "EGYPTIAN",
  "UMM_AL_QURA",
  "KARACHI",
  "TEHRAN",
  "SHIA"
];

const PRAYERS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

export default function PrayerTimesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [settings, setSettings] = useState<CalcSettings>({ calculation_method: "MUSLIM_WORLD_LEAGUE" });
  const [overrides, setOverrides] = useState<Override[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  const [previewCityId, setPreviewCityId] = useState<number | "">("");
  const [previewDate, setPreviewDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [previewData, setPreviewData] = useState<any>(null);

  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideForm, setOverrideForm] = useState<Partial<Override>>({
    city: 0,
    date: format(new Date(), "yyyy-MM-dd"),
    prayer_name: "fajr",
    overridden_time: "05:00",
    reason: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [citiesRes, settingsRes, overridesRes] = await Promise.all([
        api.get("/api/v1/prayer-times/cities/"),
        api.get("/api/v1/prayer-times/settings/"),
        api.get("/api/v1/prayer-times/overrides/")
      ]);
      
      setCities(citiesRes.data.results || citiesRes.data);
      setSettings(settingsRes.data);
      setOverrides(overridesRes.data.results || overridesRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCityActive = async (city: City) => {
    try {
      await api.patch(`/api/v1/prayer-times/cities/${city.id}/`, { is_active: !city.is_active });
      fetchData();
    } catch (error) {
      console.error("Error toggling city", error);
    }
  };

  const saveSettings = async () => {
    try {
      await api.put("/api/v1/prayer-times/settings/", settings);
      alert("Settings saved successfully.");
      if (previewCityId && previewDate) loadPreview();
    } catch (error) {
      console.error("Error saving settings", error);
      alert("Failed to save settings.");
    }
  };

  const loadPreview = async () => {
    if (!previewCityId || !previewDate) return;
    try {
      const res = await api.get(`/api/v1/prayer-times/?city=${previewCityId}&date=${previewDate}`);
      setPreviewData(res.data);
    } catch (error) {
      console.error("Preview error", error);
      setPreviewData(null);
    }
  };

  const saveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (overrideForm.id) {
        await api.put(`/api/v1/prayer-times/overrides/${overrideForm.id}/`, overrideForm);
      } else {
        await api.post("/api/v1/prayer-times/overrides/", overrideForm);
      }
      setShowOverrideForm(false);
      setOverrideForm({ city: 0, date: format(new Date(), "yyyy-MM-dd"), prayer_name: "fajr", overridden_time: "05:00", reason: "" });
      fetchData();
      if (previewCityId === overrideForm.city && previewDate === overrideForm.date) loadPreview();
    } catch (error) {
      console.error("Error saving override", error);
      alert("Failed to save override.");
    }
  };

  const deleteOverride = async (id: number) => {
    if (!confirm("Remove this override?")) return;
    try {
      await api.delete(`/api/v1/prayer-times/overrides/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting override", error);
    }
  };

  if (loading) return <div className="p-6">Loading prayer timings...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prayer Timings</h1>
        <p className="text-gray-500">Manage supported cities, calculation methods, and manual time overrides.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Settings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Calculation Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  className="w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                  value={settings.calculation_method}
                  onChange={(e) => setSettings({ ...settings, calculation_method: e.target.value })}
                >
                  {METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <button onClick={saveSettings} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition">
                Save Method
              </button>
            </div>
          </div>

          {/* Cities */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Cities</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordinates</th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cities.map((city) => (
                    <tr key={city.id}>
                      <td className="px-3 py-4 text-sm font-medium text-gray-900">{city.name}, {city.country}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">{city.latitude}, {city.longitude}</td>
                      <td className="px-3 py-4 text-sm text-right">
                        <button
                          onClick={() => toggleCityActive(city)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${city.is_active ? "bg-amber-500" : "bg-gray-200"}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${city.is_active ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Preview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 bg-slate-50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Eye className="w-5 h-5"/> Live Preview</h2>
            <div className="flex gap-4 mb-4">
              <select
                className="flex-1 p-2 border rounded focus:ring-amber-500"
                value={previewCityId}
                onChange={(e) => setPreviewCityId(Number(e.target.value))}
              >
                <option value="">Select City...</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                type="date"
                className="flex-1 p-2 border rounded focus:ring-amber-500"
                value={previewDate}
                onChange={(e) => setPreviewDate(e.target.value)}
              />
              <button onClick={loadPreview} className="px-4 py-2 bg-gray-900 text-white rounded font-medium hover:bg-gray-800">
                Load
              </button>
            </div>
            {previewData ? (
              <div className="grid grid-cols-3 gap-4">
                {PRAYERS.map(p => (
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

          {/* Overrides */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manual Overrides</h2>
              <button onClick={() => setShowOverrideForm(true)} className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium text-sm">
                <Plus className="w-4 h-4"/> Add Override
              </button>
            </div>

            {showOverrideForm && (
              <form onSubmit={saveOverride} className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-lg space-y-4 relative">
                <button type="button" onClick={() => setShowOverrideForm(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5"/>
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <select required className="w-full p-2 border rounded" value={overrideForm.city} onChange={e => setOverrideForm({...overrideForm, city: Number(e.target.value)})}>
                      <option value={0}>Select City</option>
                      {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                    <input required type="date" className="w-full p-2 border rounded" value={overrideForm.date} onChange={e => setOverrideForm({...overrideForm, date: e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Prayer</label>
                    <select required className="w-full p-2 border rounded" value={overrideForm.prayer_name} onChange={e => setOverrideForm({...overrideForm, prayer_name: e.target.value})}>
                      {PRAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Time (HH:MM:SS)</label>
                    <input required type="time" step="1" className="w-full p-2 border rounded" value={overrideForm.overridden_time} onChange={e => setOverrideForm({...overrideForm, overridden_time: e.target.value})}/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                    <input required type="text" className="w-full p-2 border rounded" value={overrideForm.reason} onChange={e => setOverrideForm({...overrideForm, reason: e.target.value})}/>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700">Save</button>
                </div>
              </form>
            )}

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Act</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overrides.map((ov) => {
                    const cityName = cities.find(c => c.id === ov.city)?.name || ov.city;
                    return (
                      <tr key={ov.id}>
                        <td className="px-3 py-2 text-sm">
                          <div className="font-medium text-gray-900">{cityName} - {ov.date}</div>
                          <div className="text-gray-500">{ov.prayer_name}: <span className="font-bold text-amber-600">{ov.overridden_time}</span></div>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-500">{ov.reason}</td>
                        <td className="px-3 py-2 text-sm text-right">
                          <button onClick={() => deleteOverride(ov.id)} className="text-red-500 hover:text-red-700"><Trash className="w-4 h-4"/></button>
                        </td>
                      </tr>
                    );
                  })}
                  {overrides.length === 0 && <tr><td colSpan={3} className="px-3 py-4 text-center text-sm text-gray-500">No overrides set.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
