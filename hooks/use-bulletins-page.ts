import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useBulletinsPage() {
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/bulletins/");
      setBulletins(res.data.results || res.data);
    } catch {
      toast.error("Failed to load bulletins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleNotifyBulletin = async (id: number) => {
    try {
      setNotifyingId(id);
      await api.post(`/api/v1/bulletins/${id}/notify`);
      toast.success("Push notification broadcasted to all users successfully!");
    } catch {
      toast.error("Failed to send push notification.");
    } finally {
      setNotifyingId(null);
    }
  };

  const deleteBulletin = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bulletin?")) return;
    try {
      await api.delete(`/api/v1/bulletins/${id}`);
      toast.success("Bulletin deleted.");
      fetchData();
    } catch {
      toast.error("Failed to delete bulletin.");
    }
  };

  return { bulletins, loading, showForm, setShowForm, notifyingId, isSubmitting, setIsSubmitting, fetchData, handleNotifyBulletin, deleteBulletin };
}

