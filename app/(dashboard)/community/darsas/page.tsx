"use client";

import { Plus, BookOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useDarsasPage } from "@/hooks/use-darsas-page";
import { DarsaForm } from "@/components/community/DarsaForm";
import { DarsasTable } from "@/components/community/DarsasTable";

export default function DarsasPage() {
  const {
    darsas, loading, isSubmitting, setIsSubmitting, showForm, setShowForm,
    editingDarsa, setEditingDarsa, fetchDarsas, togglePublish, handleDelete
  } = useDarsasPage();

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>Darsas & Classes</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Manage Islamic learning sessions and class schedules.</p>
          </div>
        </div>
        <button onClick={() => { setEditingDarsa(null); setShowForm(!showForm); }} className={showForm ? "btn-secondary" : "btn-primary"}>
          {showForm ? "✕ Cancel" : <><Plus className="w-4 h-4 inline mr-1" /> Add Darsa</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <DarsaForm
              initial={editingDarsa}
              onClose={() => { setShowForm(false); setEditingDarsa(null); }}
              onSuccess={() => { setShowForm(false); setEditingDarsa(null); fetchDarsas(); }}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DarsasTable
        darsas={darsas}
        onTogglePublish={togglePublish}
        onEdit={(d) => { setEditingDarsa(d); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        onDelete={handleDelete}
      />
      <ProcessingModal isOpen={isSubmitting} />
    </div>
  );
}
