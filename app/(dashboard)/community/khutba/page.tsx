"use client";

import { Plus, FileText, History, Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useKhutbaPage } from "@/hooks/use-khutba-page";
import { KhutbaFormModal } from "@/components/community/KhutbaFormModal";
import { KhutbaTable } from "@/components/community/KhutbaTable";
import { NotificationLogsTable } from "@/components/community/NotificationLogsTable";

export default function KhutbaPage() {
  const {
    khutbas, logs, loading, isSubmitting, setIsSubmitting, activeTab, setActiveTab,
    showForm, setShowForm, editingKhutba, setEditingKhutba, fetchData, deleteKhutba, notifyKhutba
  } = useKhutbaPage();

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
          <Mic className="w-5 h-5 text-[#c99335]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>Friday Khutba</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Manage weekly Juma Khutba topics and send push notifications.</p>
        </div>
      </div>

      <div className="border-b border-gray-200 flex items-center gap-1">
        {[{ id: "khutbas", label: "Khutbas", icon: FileText }, { id: "logs", label: "Notification History", icon: History }].map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === tab.id ? "border-[#c99335] text-[#1a1512]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "khutbas" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Khutba Schedule</h2>
            <button onClick={() => { setEditingKhutba(null); setShowForm(!showForm); }} className={showForm ? "btn-secondary" : "btn-primary"}>
              {showForm ? "✕ Cancel" : <><Plus className="w-4 h-4 inline mr-1" /> Add Khutba</>}
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <KhutbaFormModal
                  initial={editingKhutba}
                  onClose={() => { setShowForm(false); setEditingKhutba(null); }}
                  onSuccess={() => { setShowForm(false); setEditingKhutba(null); fetchData(); }}
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <KhutbaTable khutbas={khutbas} onNotify={notifyKhutba} onEdit={(k) => { setEditingKhutba(k); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} onDelete={deleteKhutba} />
        </div>
      )}

      {activeTab === "logs" && <NotificationLogsTable logs={logs} />}
      <ProcessingModal isOpen={isSubmitting} />
    </div>
  );
}
