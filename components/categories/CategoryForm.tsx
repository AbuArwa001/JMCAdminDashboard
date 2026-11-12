"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Palette } from "lucide-react";
import { updateCategory, createCategory } from "@/lib/api_data";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryPreviewCard } from "./CategoryPreviewCard";

interface CategoryFormProps {
  initialData?: { id?: string; category_name: string; color: string; };
  isEditing?: boolean;
}

export default function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_name: initialData?.category_name || "",
    color: initialData?.color || "#006838",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing && initialData?.id) await updateCategory(initialData.id, formData);
      else await createCategory(formData);
      toast.success(isEditing ? "Category updated" : "Category created");
      router.push("/categories");
      router.refresh();
    } catch { toast.error("Failed to save category"); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="form-section max-w-lg">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
          <Palette className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            {isEditing ? "Edit Category" : "New Category"}
          </h3>
          <p className="text-[11px] text-gray-400">Name and colour identifier for this fund type</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-section-body space-y-6">
        <div>
          <label className="form-label">Category Name <span className="text-rose-500 normal-case font-bold">*</span></label>
          <input
            type="text"
            required
            value={formData.category_name}
            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
            className="form-input"
            placeholder="e.g. Education, Mosque Maintenance, Zakat..."
          />
        </div>

        <CategoryColorPicker color={formData.color} onChange={(color) => setFormData({ ...formData, color })} />
        <CategoryPreviewCard name={formData.category_name} color={formData.color} />

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {isEditing ? "Update Category" : "Create Category"}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
