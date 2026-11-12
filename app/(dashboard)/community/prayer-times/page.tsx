"use client";

import { TableSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { usePrayerTimes } from "@/hooks/use-prayer-times";
import { PrayerCalcSettings } from "@/components/community/PrayerCalcSettings";
import { PrayerCitiesTable } from "@/components/community/PrayerCitiesTable";
import { PrayerLivePreview } from "@/components/community/PrayerLivePreview";
import { PrayerOverridesSection } from "@/components/community/PrayerOverridesSection";

export default function PrayerTimesPage() {
  const {
    cities, overrides, settings, setSettings, loading, isSubmitting, setIsSubmitting,
    previewCityId, setPreviewCityId, previewDate, setPreviewDate, previewData,
    fetchData, loadPreview, toggleCityActive, deleteOverride
  } = usePrayerTimes();

  if (loading) return <TableSkeleton />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Prayer Timings</h1>
        <p className="text-gray-500">Manage supported cities, calculation methods, and manual time overrides.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PrayerCalcSettings settings={settings} onSettingsChange={setSettings} onRefreshPreview={loadPreview} />
          <PrayerCitiesTable cities={cities} onToggleActive={toggleCityActive} />
        </div>

        <div className="space-y-8">
          <PrayerLivePreview
            cities={cities}
            previewCityId={previewCityId}
            previewDate={previewDate}
            previewData={previewData}
            onCityChange={(id) => setPreviewCityId(id)}
            onDateChange={(d) => setPreviewDate(d)}
            onLoad={loadPreview}
          />
          <PrayerOverridesSection
            cities={cities}
            overrides={overrides}
            onRefresh={fetchData}
            onDelete={deleteOverride}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
      <ProcessingModal isOpen={isSubmitting} />
    </div>
  );
}
