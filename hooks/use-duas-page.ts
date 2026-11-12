import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useDuasPage() {
  const [categories, setCategories] = useState<any[]>([]), [duas, setDuas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingCat, setIsSubmittingCat] = useState(false), [isSubmittingDua, setIsSubmittingDua] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [c, d] = await Promise.all([api.get("/api/v1/duas/categories/"), api.get("/api/v1/duas/")]);
      const cats = c.data.results || c.data;
      setCategories(cats);
      setDuas(d.data.results || d.data);
      if (cats.length > 0 && !selectedCategoryId) setSelectedCategoryId(cats[0].id);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/api/v1/duas/categories/${id}/`);
    if (selectedCategoryId === id) setSelectedCategoryId(null);
    fetchData();
  };

  const deleteDua = async (id: number) => {
    if (!confirm("Delete this dua?")) return;
    await api.delete(`/api/v1/duas/${id}/`);
    fetchData();
  };

  return { categories, duas, loading, isSubmittingCat, setIsSubmittingCat, isSubmittingDua, setIsSubmittingDua, selectedCategoryId, setSelectedCategoryId, fetchData, deleteCategory, deleteDua };
}
