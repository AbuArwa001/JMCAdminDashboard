import { useState, useEffect } from "react";
import api from "@/lib/api";
import { format } from "date-fns";

export function useEventsPage() {
  const [events, setEvents] = useState<any[]>([]), [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true), [showForm, setShowForm] = useState(false);
  const [galleryEvent, setGalleryEvent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eRes, cRes] = await Promise.all([api.get("/api/v1/events/"), api.get("/api/v1/events/categories/")]);
      setEvents(eRes.data.results || eRes.data);
      setCategories(cRes.data.results || cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/api/v1/events/${id}/`);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const notifyEvent = async (id: number) => {
    if (!confirm("Send push notification to all devices for this event?")) return;
    try {
      const res = await api.post(`/api/v1/events/${id}/notify/`);
      alert(res.data.status === "No devices registered" ? "No devices registered." : `Notification sent! Delivered to ${res.data.success_count || 0} devices.`);
    } catch { alert("Failed to send notification."); }
  };

  return { events, categories, loading, showForm, setShowForm, galleryEvent, setGalleryEvent, isSaving, setIsSaving, fetchData, deleteEvent, notifyEvent };
}

