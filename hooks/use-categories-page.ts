import { useState, useEffect } from "react";
import { getCategories, deleteCategory, getTransactions, getDonationDrives } from "@/lib/api_data";
import { CategoryData } from "@/lib/data";
import { toast } from "sonner";

export function useCategoriesPage() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCats = async () => {
    try {
      setIsLoading(true);
      const [cats, txs, drives] = await Promise.all([
        getCategories().catch(() => []),
        getTransactions().catch(() => []),
        getDonationDrives().catch(() => []),
      ]);
      const driveMap = (drives || []).reduce((acc: any, d: any) => ({ ...acc, [d.id]: d }), {});
      const totals: Record<string, number> = {};
      (txs || []).forEach((t: any) => {
        if (t.payment_status === "Completed") {
          const d = t.donation && typeof t.donation === "object" ? t.donation : driveMap[t.donation_id || t.donation];
          const cid = d?.category_id || d?.category;
          if (cid) totals[cid] = (totals[cid] || 0) + (Number(t.amount) || 0);
        }
      });
      setCategories((cats || []).map((c: any) => ({ ...c, total_amount: totals[c.id] || 0 })));
    } catch { toast.error("Failed to load categories"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchCats(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch { toast.error("Failed to delete category"); }
  };

  return { categories, isLoading, handleDelete, refresh: fetchCats };
}

