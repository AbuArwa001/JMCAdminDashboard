"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

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
      setFeatures(response.data);
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
      fetchFeatures(); // Refresh the list
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  if (loading) return <div className="p-6">Loading features...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Feature Management</h1>
      <p className="text-gray-500 mb-8">Master Switch for all JamiaGive app features.</p>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {features.map((feature) => (
            <li key={feature.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {feature.name.replace("_", " ")}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
              </div>
              <button
                onClick={() => toggleFeature(feature)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  feature.is_active ? "bg-amber-500" : "bg-gray-200"
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
          {features.length === 0 && (
            <li className="p-6 text-center text-gray-500">No features configured yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
