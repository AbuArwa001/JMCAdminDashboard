"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { format } from "date-fns";

interface NisabRate {
  id?: number;
  gold_price_per_gram: string | number;
  silver_price_per_gram: string | number;
  currency: string;
  updated_at?: string;
  updated_by?: string;
}

export default function ZakatSettingsPage() {
  const [rate, setRate] = useState<NisabRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<NisabRate>({
    gold_price_per_gram: "",
    silver_price_per_gram: "",
    currency: "KES",
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchNisab = async () => {
    try {
      const response = await api.get("/api/v1/zakat/nisab-rate/");
      setRate(response.data);
      setFormData({
        gold_price_per_gram: response.data.gold_price_per_gram || "",
        silver_price_per_gram: response.data.silver_price_per_gram || "",
        currency: response.data.currency || "KES",
      });
    } catch (error) {
      console.error("Error fetching nisab rate:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNisab();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.patch("/api/v1/zakat/nisab-rate/", formData);
      setMessage({ type: 'success', text: "Nisab rates updated successfully." });
      fetchNisab();
    } catch (error) {
      console.error("Error updating nisab rate:", error);
      setMessage({ type: 'error', text: "Failed to update Nisab rates." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading Zakat settings...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Zakat Calculator Settings</h1>
        <p className="text-gray-500">Update current gold and silver prices to accurately calculate Nisab.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {message && (
          <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gold Price (per gram)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="pl-12 w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                  value={formData.gold_price_per_gram}
                  onChange={(e) => setFormData({ ...formData, gold_price_per_gram: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Silver Price (per gram)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{formData.currency}</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="pl-12 w-full p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
                  value={formData.silver_price_per_gram}
                  onChange={(e) => setFormData({ ...formData, silver_price_per_gram: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Code
            </label>
            <input
              type="text"
              required
              className="w-full md:w-1/2 p-2 border rounded focus:ring-amber-500 focus:border-amber-500"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              placeholder="e.g. KES, USD"
            />
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {rate?.updated_at && (
                <span>
                  Last updated: {format(new Date(rate.updated_at), "PPpp")}
                  {rate.updated_by && ` by ${rate.updated_by}`}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
