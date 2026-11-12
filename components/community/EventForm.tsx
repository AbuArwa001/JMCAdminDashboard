import { useState } from "react";
import { format } from "date-fns";
import { Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";
import RichTextEditor from "@/components/RichTextEditor";

interface Props {
  initial?: any;
  categories: any[];
  onClose: () => void;
  onSuccess: () => void;
  isSaving: boolean;
  setIsSaving: (b: boolean) => void;
}

export function EventForm({ initial, categories, onClose, onSuccess, isSaving, setIsSaving }: Props) {
  const [form, setForm] = useState(initial || {
    title: "", category: "", story: "", event_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "10:00", end_time: "", venue_name: "", venue_address: "", venue_map_link: "", guest_name: "", published: true
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [guestPhoto, setGuestPhoto] = useState<File | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async () => {
    const prompt = window.prompt("What should the event story be about?");
    if (!prompt) return;
    try {
      setIsGeneratingAI(true);
      const res = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setForm((p: any) => ({ ...p, story: data.content }));
    } catch (e: any) { alert("AI Generation failed: " + e.message); } finally { setIsGeneratingAI(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => { if (form[k] !== null && form[k] !== "") data.append(k, form[k]); });
      if (coverImage) data.append("cover_image", coverImage);
      if (guestPhoto) data.append("guest_photo", guestPhoto);
      const url = form.id ? `/api/v1/events/${form.id}/` : "/api/v1/events/";
      await api[form.id ? "patch" : "post"](url, data, { headers: { "Content-Type": "multipart/form-data" } });
      onSuccess();
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
      <h2 className="text-2xl font-bold text-gray-800">{form.id ? "Edit Event Details" : "New Event Details"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2"><label className="block text-sm font-semibold mb-1">Title *</label><input required type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Weekly Tafseer" /></div>
        <div><label className="block text-sm font-semibold mb-1">Category</label><select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select...</option>{categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
        <div><label className="block text-sm font-semibold mb-1">Date *</label><input required type="date" className="form-input" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
        <div><label className="block text-sm font-semibold mb-1">Start Time *</label><input required type="time" className="form-input" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
        <div><label className="block text-sm font-semibold mb-1">End Time</label><input type="time" className="form-input" value={form.end_time || ""} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
        <div><label className="block text-sm font-semibold mb-1">Venue Name *</label><input required type="text" className="form-input" value={form.venue_name} onChange={(e) => setForm({ ...form, venue_name: e.target.value })} placeholder="Main Prayer Hall" /></div>
        <div><label className="block text-sm font-semibold mb-1">Guest Speaker</label><input type="text" className="form-input" value={form.guest_name || ""} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} placeholder="Mufti Menk" /></div>
        <div className="md:col-span-2 space-y-2">
          <div className="flex justify-between items-center"><label className="block text-sm font-semibold">Story Details</label><button type="button" onClick={handleGenerateAI} disabled={isGeneratingAI} className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg flex items-center gap-1.5 font-bold border border-amber-200">{isGeneratingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}AI Generate</button></div>
          <RichTextEditor value={form.story || ""} onChange={(c) => setForm({ ...form, story: c })} placeholder="Event description..." />
        </div>
        <div><label className="block text-sm font-semibold mb-1">Cover Image</label><input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="text-sm" /></div>
        <div><label className="block text-sm font-semibold mb-1">Guest Photo</label><input type="file" accept="image/*" onChange={(e) => setGuestPhoto(e.target.files?.[0] || null)} className="text-sm" /></div>
        <div className="md:col-span-2 flex items-center p-3 bg-green-50 rounded-xl border border-green-100"><input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4" /><label htmlFor="published" className="ml-2 text-sm font-semibold text-green-800">Publish Immediately</label></div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100"><button type="button" onClick={onClose} className="btn-secondary" disabled={isSaving}>Cancel</button><button type="submit" disabled={isSaving} className="btn-primary">Save Event</button></div>
    </form>
  );
}

