"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GridCardSkeleton } from "@/components/ui/PremiumSkeletons";
import { ProcessingModal } from "@/components/ui/ProcessingModal";
import { useEventsPage } from "@/hooks/use-events-page";
import { EventCard } from "@/components/community/EventCard";
import { EventForm } from "@/components/community/EventForm";
import { EventGalleryModal } from "@/components/community/EventGalleryModal";

export default function EventsPage() {
  const {
    events, categories, loading, showForm, setShowForm, galleryEvent, setGalleryEvent,
    isSaving, setIsSaving, fetchData, deleteEvent, notifyEvent
  } = useEventsPage();
  const [editingEvent, setEditingEvent] = useState<any>(null);

  if (loading) return <GridCardSkeleton />;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1">Mosque Events</h1>
          <p className="text-gray-500 font-medium">Manage and broadcast mosque events to the community.</p>
        </div>
        <button onClick={() => { setEditingEvent(null); setShowForm(!showForm); }} className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" /> {showForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {showForm && (
        <EventForm
          initial={editingEvent}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingEvent(null); }}
          onSuccess={() => { setShowForm(false); setEditingEvent(null); fetchData(); }}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      )}

      <ProcessingModal isOpen={isSaving} />
      {galleryEvent && <EventGalleryModal event={galleryEvent} onClose={() => setGalleryEvent(null)} onRefresh={fetchData} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            onGallery={setGalleryEvent}
            onNotify={notifyEvent}
            onEdit={(item) => { setEditingEvent({ ...item, category: item.category || "" }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            onDelete={deleteEvent}
          />
        ))}
      </div>
    </div>
  );
}
