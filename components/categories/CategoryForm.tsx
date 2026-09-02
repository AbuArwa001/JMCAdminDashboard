"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, Palette } from "lucide-react";
import { updateCategory, createCategory } from "@/lib/api_data";

interface CategoryFormProps {
  initialData?: {
    id?: string;
    category_name: string;
    color: string;
  };
  isEditing?: boolean;
}

const PRESET_COLORS = [
  "#006838", "#c99335", "#4a2311", "#5ea38c", "#db5a27",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
  "#ef4444", "#0ea5e9", "#10b981", "#6366f1", "#84cc16",
];

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
      if (isEditing && initialData?.id) {
        await updateCategory(initialData.id, formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }
      router.push("/categories");
      router.refresh();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section max-w-lg">
      {/* Section Header */}
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
        {/* Category Name */}
        <div>
          <label className="form-label">
            Category Name <span className="text-rose-500 normal-case font-bold">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.category_name}
            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
            className="form-input"
            placeholder="e.g. Education, Mosque Maintenance, Zakat..."
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="form-label">Category Colour</label>

          {/* Preset swatches */}
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className="w-8 h-8 rounded-lg border-2 transition-all duration-150 hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: formData.color === color ? "#1a1512" : "transparent",
                  boxShadow: formData.color === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none",
                }}
                title={color}
              />
            ))}
          </div>

          {/* Custom color + preview */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-10 w-16 p-0.5 rounded-lg border border-gray-200 cursor-pointer bg-white"
            />
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg shadow-sm border border-white/50"
                style={{ backgroundColor: formData.color }}
              />
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Selected</p>
                <p className="text-sm font-mono font-semibold text-gray-900">{formData.color.toUpperCase()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 ml-auto">Custom hex</p>
          </div>
        </div>

        {/* Preview pill */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="form-label mb-2">Preview</p>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: formData.color }} />
            <div>
              <p className="text-sm font-bold text-gray-900">{formData.category_name || "Category Name"}</p>
              <p className="text-xs text-gray-400 mt-0.5">Donation fund category</p>
            </div>
            <span
              className="ml-auto px-3 py-1 text-xs font-bold rounded-full text-white"
              style={{ backgroundColor: formData.color }}
            >
              Sample
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> {isEditing ? "Update Category" : "Create Category"}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
