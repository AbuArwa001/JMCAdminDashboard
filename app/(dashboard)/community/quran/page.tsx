"use client";

import { Users, Music } from "lucide-react";
import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useQuranPage } from "@/hooks/use-quran-page";
import { QuranRecitersTab } from "@/components/community/QuranRecitersTab";
import { QuranAudioTab } from "@/components/community/QuranAudioTab";

export default function QuranPage() {
  const {
    reciters, audios, loading, activeTab, setActiveTab,
    isSubmittingReciter, setIsSubmittingReciter, isSubmittingAudio, setIsSubmittingAudio,
    fetchData, deleteReciter, deleteAudio
  } = useQuranPage();

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quran Management</h1>
        <p className="text-gray-500">Manage reciters and Surah audio files.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab("reciters")} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === "reciters" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
            <Users className="w-5 h-5" /> Reciters
          </button>
          <button onClick={() => setActiveTab("audio")} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === "audio" ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
            <Music className="w-5 h-5" /> Surah Audio
          </button>
        </nav>
      </div>

      {activeTab === "reciters" && (
        <QuranRecitersTab
          reciters={reciters}
          onRefresh={fetchData}
          onDelete={deleteReciter}
          isSubmitting={isSubmittingReciter}
          setIsSubmitting={setIsSubmittingReciter}
        />
      )}

      {activeTab === "audio" && (
        <QuranAudioTab
          audios={audios}
          reciters={reciters}
          onRefresh={fetchData}
          onDelete={deleteAudio}
          isSubmitting={isSubmittingAudio}
          setIsSubmitting={setIsSubmittingAudio}
        />
      )}

      <ProcessingModal isOpen={isSubmittingReciter || isSubmittingAudio} />
    </div>
  );
}
