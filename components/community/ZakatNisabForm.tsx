import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Props {
  rate: any;
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

export function ZakatNisabForm({ rate, onSave, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    gold_price_per_gram: rate?.gold_price_per_gram || "",
    silver_price_per_gram: rate?.silver_price_per_gram || "",
    currency: rate?.currency || "KES",
  });

  useEffect(() => {
    if (rate) {
      setFormData({
        gold_price_per_gram: rate.gold_price_per_gram || "",
        silver_price_per_gram: rate.silver_price_per_gram || "",
        currency: rate.currency || "KES",
      });
    }
  }, [rate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gold Price (per gram)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 sm:text-sm">{formData.currency}</span>
            <input type="number" step="0.01" required className="pl-12 w-full p-2 border rounded focus:ring-amber-500" value={formData.gold_price_per_gram} onChange={(e) => setFormData({ ...formData, gold_price_per_gram: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Silver Price (per gram)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 sm:text-sm">{formData.currency}</span>
            <input type="number" step="0.01" required className="pl-12 w-full p-2 border rounded focus:ring-amber-500" value={formData.silver_price_per_gram} onChange={(e) => setFormData({ ...formData, silver_price_per_gram: e.target.value })} />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Currency Code</label>
        <input type="text" required className="w-full md:w-1/2 p-2 border rounded focus:ring-amber-500" value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} placeholder="e.g. KES, USD" />
      </div>
      <div className="pt-4 flex justify-between items-center border-t border-gray-100">
        <div className="text-sm text-gray-500">{rate?.updated_at && <span>Last updated: {format(new Date(rate.updated_at), "PPpp")}{rate.updated_by && ` by ${rate.updated_by}`}</span>}</div>
        <button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white rounded px-6 py-2 font-medium disabled:cursor-not-allowed">Save Settings</button>
      </div>
    </form>
  );
}
