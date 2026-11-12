"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useDuasPage } from "@/hooks/use-duas-page";
import { DuaCategoriesSidebar } from "@/components/community/DuaCategoriesSidebar";
import { DuaFormModal } from "@/components/community/DuaFormModal";
import { DuasList } from "@/components/community/DuasList";

export default function DuasPage() {
  const {
    categories, duas, loading, isSubmittingCat, setIsSubmittingCat, isSubmittingDua, setIsSubmittingDua,
    selectedCategoryId, setSelectedCategoryId, fetchData, deleteCategory, deleteDua
  } = useDuasPage();

  const [showDuaForm, setShowDuaForm] = useState(false);
  const [editingDua, setEditingDua] = useState<any>(null);

  if (loading) return <TableSkeleton />;

  const currentDuas = duas
    .filter((d) => (d.category_id ?? d.category) === selectedCategoryId)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Duas Management</h1>
        <p className="text-gray-500">Manage categories and authentic supplications.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <DuaCategoriesSidebar
          categories={categories}
          duas={duas}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onRefresh={fetchData}
          onDeleteCategory={deleteCategory}
          isSubmittingCat={isSubmittingCat}
          setIsSubmittingCat={setIsSubmittingCat}
        />

        <div className="w-full lg:w-2/3 space-y-4">
          {selectedCategoryId ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Duas in Category</h2>
                <button onClick={() => { setEditingDua(null); setShowDuaForm(true); }} className="px-4 py-2 bg-gray-900 text-white rounded font-medium text-sm hover:bg-gray-800 flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Dua
                </button>
              </div>

              {showDuaForm && (
                <DuaFormModal
                  initial={editingDua}
                  categoryId={selectedCategoryId}
                  onClose={() => { setShowDuaForm(false); setEditingDua(null); }}
                  onSuccess={() => { setShowDuaForm(false); setEditingDua(null); fetchData(); }}
                  isSubmittingDua={isSubmittingDua}
                  setIsSubmittingDua={setIsSubmittingDua}
                />
              )}

              <DuasList
                duas={currentDuas}
                onEdit={(d) => { setEditingDua(d); setShowDuaForm(true); }}
                onDelete={deleteDua}
              />
            </>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
              Select a category to view and manage its duas.
            </div>
          )}
        </div>
      </div>
      <ProcessingModal isOpen={isSubmittingCat || isSubmittingDua} />
    </div>
  );
}
