"use client";

import { GridCardSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useInspirationPage } from "@/hooks/use-inspiration-page";
import { InspirationForm } from "@/components/community/InspirationForm";
import { InspirationCard } from "@/components/community/InspirationCard";

export default function InspirationPage() {
  const {
    items, loading, isSubmitting, setIsSubmitting, showForm, setShowForm,
    fetchItems, togglePublish, handleDelete
  } = useInspirationPage();

  if (loading) return <GridCardSkeleton />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Daily Inspiration</h1>
          <p className="text-gray-500">Manage Hadith or Ayah of the day.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 transition">
          {showForm ? "Cancel" : "Add Inspiration"}
        </button>
      </div>

      {showForm && (
        <InspirationForm
          onSuccess={() => { setShowForm(false); fetchItems(); }}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <InspirationCard key={item.id} item={item} onTogglePublish={togglePublish} onDelete={handleDelete} />
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-gray-100">
            No daily inspiration items found. Add one to get started!
          </div>
        )}
      </div>
      <ProcessingModal isOpen={isSubmitting} />
    </div>
  );
}
