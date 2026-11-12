import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useDarsasPage() {
  const [darsas, setDarsas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDarsa, setEditingDarsa] = useState<any>(null);

  const fetchDarsas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/community/content/?content_type=DARSA");
      setDarsas(res.data.results || res.data);
    } catch {
      toast.error("Failed to load darsas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDarsas(); }, []);

  const togglePublish = async (darsa: any) => {
    try {
      await api.patch(`/api/v1/community/content/${darsa.id}/`, { is_published: !darsa.is_published });
      fetchDarsas();
    } catch { toast.error("Failed to update status."); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Darsa?")) return;
    try {
      await api.delete(`/api/v1/community/content/${id}/`);
      toast.success("Darsa deleted.");
      fetchDarsas();
    } catch { toast.error("Failed to delete darsa."); }
  };

  return { darsas, loading, isSubmitting, setIsSubmitting, showForm, setShowForm, editingDarsa, setEditingDarsa, fetchDarsas, togglePublish, handleDelete };
}

