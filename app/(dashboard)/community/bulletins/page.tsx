"use client";

import { Plus, Newspaper } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useBulletinsPage } from "@/hooks/use-bulletins-page";
import { BulletinForm } from "@/components/community/BulletinForm";
import { BulletinsTable } from "@/components/community/BulletinsTable";

export default function BulletinsPage() {
  const {
    bulletins, loading, showForm, setShowForm, notifyingId, isSubmitting, setIsSubmitting,
    fetchData, handleNotifyBulletin, deleteBulletin
  } = useBulletinsPage();

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center shadow-md">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>Friday Bulletins</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Upload and manage weekly Friday Bulletins for the mobile app.</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? "btn-secondary" : "btn-primary bg-blue-600 hover:bg-blue-700"}>
          {showForm ? "✕ Cancel" : <><Plus className="w-4 h-4 inline mr-1" /> Upload Bulletin</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <BulletinForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); fetchData(); }} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} />
          </motion.div>
        )}
      </AnimatePresence>

      <BulletinsTable bulletins={bulletins} notifyingId={notifyingId} onNotify={handleNotifyBulletin} onDelete={deleteBulletin} />
      <ProcessingModal isOpen={isSubmitting} />
    </div>
  );
}
