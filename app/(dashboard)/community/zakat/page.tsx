"use client";

import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useZakatSettings } from "@/hooks/use-zakat-settings";
import { ZakatNisabForm } from "@/components/community/ZakatNisabForm";

export default function ZakatSettingsPage() {
  const { rate, loading, isSubmitting, message, saveNisab } = useZakatSettings();

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Zakat Calculator Settings</h1>
        <p className="text-gray-500">Update current gold and silver prices to accurately calculate Nisab.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {message && (
          <div className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </div>
        )}
        <ZakatNisabForm rate={rate} onSave={saveNisab} isSubmitting={isSubmitting} />
      </div>

      <ProcessingModal isOpen={isSubmitting} />
    </div>
  );
}
