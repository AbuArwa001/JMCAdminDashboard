"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export function DeleteAccountForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirm) return;

    setLoading(true);
    try {
      const res = await fetch("/api/account-deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Unable to process request. Please contact support@jamiamosque.co.ke directly.");
      }
    } catch {
      alert("Network error. Please try again or email support@jamiamosque.co.ke.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 my-8">
        <CheckCircle2 className="w-12 h-12 text-[#006838] mx-auto" />
        <h3 className="text-base font-bold text-gray-900">Deletion Request Received</h3>
        <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
          Your request for account <strong>{formData.email}</strong> has been logged. Our administration team will verify your account and complete data deletion within 14 to 30 days. You will receive confirmation at this email address.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 my-8">
      <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100">
        Submit Account Deletion Request
      </h3>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Abdullah Omar"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006838]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Registered Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006838]"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Registered Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. 0712345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006838]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Reason for Deletion (Optional)</label>
          <textarea
            rows={2}
            placeholder="Help us improve by letting us know why you are leaving..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006838]"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer text-gray-600">
            <input
              type="checkbox"
              required
              checked={formData.confirm}
              onChange={(e) => setFormData({ ...formData, confirm: e.target.checked })}
              className="mt-0.5 rounded text-[#006838] focus:ring-[#006838]"
            />
            <span>
              I confirm that I want to delete my account and understand that profile data, credentials, and saved settings will be permanently removed.
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.confirm}
        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>Submit Deletion Request</span>
      </button>
    </form>
  );
}

