"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { ToggleRight } from "lucide-react";
import { toast } from "sonner";

interface AppFeature {
  id: number;
  name: string;
  is_active: boolean;
  description: string;
}

export default function FeaturesSettingsPage() {
  const [features, setFeatures] = useState<AppFeature[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    try {
      const response = await api.get("/api/v1/core_config/features/");
      const data = response.data.results || response.data;
      setFeatures(data);
    } catch (error) {
      console.error("Error fetching features:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const toggleFeature = async (feature: AppFeature) => {
    try {
      await api.patch(`/api/v1/core_config/features/${feature.id}/`, {
        is_active: !feature.is_active,
      });
      setFeatures((prev) =>
        prev.map((f) => (f.id === feature.id ? { ...f, is_active: !f.is_active } : f))
      );
      toast.success(`Feature "${feature.name}" ${!feature.is_active ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update feature flag.");
    }
  };

  return (
    <PermissionGuard
      permission="features.manage"
      fallbackTitle="Feature Flags Restricted"
      fallbackDescription="You do not have authorization to toggle global mobile app features."
    >
      <div className="p-2 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <ToggleRight className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-[#1a1512] tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Application Feature Toggles
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Live feature control switches for JamiaGive mobile application
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50/70 transition-colors"
              >
                <div>
                  <h3 className="text-base font-bold text-gray-900 capitalize">
                    {feature.name.replace(/_/g, " ")}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </div>
                <button
                  onClick={() => toggleFeature(feature)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    feature.is_active ? "bg-[#006838]" : "bg-gray-200"
                  }`}
                  role="switch"
                  aria-checked={feature.is_active}
                >
                  <span className="sr-only">Toggle feature</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      feature.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </li>
            ))}
            {features.length === 0 && !loading && (
              <li className="p-8 text-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                No feature toggles configured in database yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </PermissionGuard>
  );
}
