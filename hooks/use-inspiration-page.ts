import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useInspirationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/community/content/?content_type=INSPIRATION");
      setItems(res.data.results || res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const togglePublish = async (item: any) => {
    await api.patch(`/api/v1/community/content/${item.id}/`, { is_published: !item.is_published });
    fetchItems();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Inspiration item?")) return;
    await api.delete(`/api/v1/community/content/${id}/`);
    fetchItems();
  };

  return { items, loading, isSubmitting, setIsSubmitting, showForm, setShowForm, fetchItems, togglePublish, handleDelete };
}

