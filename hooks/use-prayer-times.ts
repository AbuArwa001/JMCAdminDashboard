import { useState, useEffect } from "react";
import api from "@/lib/api";
import { format } from "date-fns";

export function usePrayerTimes() {
  const [cities, setCities] = useState<any[]>([]), [overrides, setOverrides] = useState<any[]>([]);
  const [settings, setSettings] = useState({ calculation_method: "MUSLIM_WORLD_LEAGUE" });
  const [loading, setLoading] = useState(true), [isSubmitting, setIsSubmitting] = useState(false);
  const [previewCityId, setPreviewCityId] = useState<number | "">("");
  const [previewDate, setPreviewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [previewData, setPreviewData] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [c, s, o] = await Promise.all([
        api.get("/api/v1/prayer-times/cities/"),
        api.get("/api/v1/prayer-times/settings/"),
        api.get("/api/v1/prayer-times/overrides/"),
      ]);
      setCities(c.data.results || c.data);
      setSettings(s.data);
      setOverrides(o.data.results || o.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const loadPreview = async () => {
    if (!previewCityId || !previewDate) return;
    try {
      const res = await api.get(`/api/v1/prayer-times/?city=${previewCityId}&date=${previewDate}`);
      setPreviewData(res.data);
    } catch { setPreviewData(null); }
  };

  const toggleCityActive = async (city: any) => {
    await api.patch(`/api/v1/prayer-times/cities/${city.id}/`, { is_active: !city.is_active });
    fetchData();
  };

  const deleteOverride = async (id: number) => {
    if (!confirm("Remove this override?")) return;
    await api.delete(`/api/v1/prayer-times/overrides/${id}/`);
    fetchData();
  };

  return { cities, overrides, settings, setSettings, loading, isSubmitting, setIsSubmitting, previewCityId, setPreviewCityId, previewDate, setPreviewDate, previewData, fetchData, loadPreview, toggleCityActive, deleteOverride };
}

