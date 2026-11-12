import { useState } from "react";
import { Plus, Edit, Trash, ChevronRight } from "lucide-react";
import api from "@/lib/api";

interface Props {
  categories: any[];
  duas: any[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  onRefresh: () => void;
  onDeleteCategory: (id: number) => void;
  isSubmittingCat: boolean;
  setIsSubmittingCat: (b: boolean) => void;
}

export function DuaCategoriesSidebar({
  categories, duas, selectedCategoryId, onSelectCategory, onRefresh, onDeleteCategory, isSubmittingCat, setIsSubmittingCat
}: Props) {
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "", icon: "", display_order: 0, id: undefined as number | undefined });

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCat(true);
    try {
      if (catForm.id) await api.put(`/api/v1/duas/categories/${catForm.id}/`, catForm);
      else await api.post("/api/v1/duas/categories/", catForm);
      setShowCatForm(false);
      onRefresh();
    } finally { setIsSubmittingCat(false); }
  };

  return (
    <div className="w-full lg:w-1/3 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Categories</h2>
        <button onClick={() => { setCatForm({ name: "", slug: "", icon: "", display_order: 0, id: undefined }); setShowCatForm(true); }} className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center">
          <Plus className="w-4 h-4 mr-1" /> Add
        </button>
      </div>
      {showCatForm && (
        <form onSubmit={saveCategory} className="bg-amber-50 p-4 rounded-lg border border-amber-100 space-y-3">
          <input type="text" placeholder="Name" required className="w-full p-2 border rounded text-sm" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
          <input type="text" placeholder="Slug" required className="w-full p-2 border rounded text-sm" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
          <div className="flex gap-2">
            <input type="text" placeholder="Icon" className="w-full p-2 border rounded text-sm" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} />
            <input type="number" placeholder="Order" required className="w-20 p-2 border rounded text-sm" value={catForm.display_order} onChange={(e) => setCatForm({ ...catForm, display_order: Number(e.target.value) })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowCatForm(false)} className="px-3 py-1 text-sm text-gray-500" disabled={isSubmittingCat}>Cancel</button>
            <button type="submit" disabled={isSubmittingCat} className="bg-amber-600 text-white rounded font-medium px-3 py-1 text-sm">Save</button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {categories.map((cat) => (
          <div key={cat.id} onClick={() => onSelectCategory(cat.id)} className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${selectedCategoryId === cat.id ? "bg-amber-50 border-l-4 border-amber-500" : "hover:bg-gray-50"}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{cat.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {duas.filter((d) => (d.category_id ?? d.category) === cat.id).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); setCatForm(cat); setShowCatForm(true); }} className="text-gray-400 hover:text-amber-600"><Edit className="w-4 h-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }} className="text-gray-400 hover:text-red-600"><Trash className="w-4 h-4" /></button>
              <ChevronRight className={`w-4 h-4 ${selectedCategoryId === cat.id ? "text-amber-500" : "text-gray-300"}`} />
            </div>
          </div>
        ))}
        {categories.length === 0 && <div className="p-4 text-center text-sm text-gray-500">No categories found.</div>}
      </div>
    </div>
  );
}
