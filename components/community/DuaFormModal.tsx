import { useState } from "react";
import api from "@/lib/api";

interface Props {
  initial?: any;
  categoryId: number;
  onClose: () => void;
  onSuccess: () => void;
  isSubmittingDua: boolean;
  setIsSubmittingDua: (b: boolean) => void;
}

export function DuaFormModal({ initial, categoryId, onClose, onSuccess, isSubmittingDua, setIsSubmittingDua }: Props) {
  const [duaForm, setDuaForm] = useState(initial || {
    title: "", arabic_text: "", transliteration: "", translation_en: "", translation_sw: "",
    source_reference: "", audio_url: "", display_order: 0, published: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDua(true);
    try {
      const payload = { ...duaForm, category_id: categoryId, category: categoryId };
      if (duaForm.id) await api.put(`/api/v1/duas/${duaForm.id}/`, payload);
      else await api.post("/api/v1/duas/", payload);
      onSuccess();
    } finally { setIsSubmittingDua(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold mb-2">{duaForm.id ? "Edit Dua" : "New Dua"}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Title *</label><input type="text" required className="w-full p-2 border rounded" value={duaForm.title} onChange={(e) => setDuaForm({ ...duaForm, title: e.target.value })} /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Arabic Text *</label><textarea required dir="rtl" rows={3} className="w-full p-2 border rounded text-right text-xl font-arabic" value={duaForm.arabic_text} onChange={(e) => setDuaForm({ ...duaForm, arabic_text: e.target.value })} /></div>
        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Transliteration</label><textarea rows={2} className="w-full p-2 border rounded" value={duaForm.transliteration} onChange={(e) => setDuaForm({ ...duaForm, transliteration: e.target.value })} /></div>
        <div className="col-span-2 md:col-span-1"><label className="block text-sm font-medium mb-1">Translation (EN) *</label><textarea required rows={3} className="w-full p-2 border rounded" value={duaForm.translation_en} onChange={(e) => setDuaForm({ ...duaForm, translation_en: e.target.value })} /></div>
        <div className="col-span-2 md:col-span-1"><label className="block text-sm font-medium mb-1">Translation (SW)</label><textarea rows={3} className="w-full p-2 border rounded" value={duaForm.translation_sw} onChange={(e) => setDuaForm({ ...duaForm, translation_sw: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-1">Source Reference</label><input type="text" className="w-full p-2 border rounded" value={duaForm.source_reference} onChange={(e) => setDuaForm({ ...duaForm, source_reference: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-1">Audio URL</label><input type="url" className="w-full p-2 border rounded" value={duaForm.audio_url} onChange={(e) => setDuaForm({ ...duaForm, audio_url: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-1">Order</label><input type="number" required className="w-full p-2 border rounded" value={duaForm.display_order} onChange={(e) => setDuaForm({ ...duaForm, display_order: Number(e.target.value) })} /></div>
        <div className="flex items-center pt-6"><input type="checkbox" id="published_dua" className="h-4 w-4" checked={duaForm.published} onChange={(e) => setDuaForm({ ...duaForm, published: e.target.checked })} /><label htmlFor="published_dua" className="ml-2 block text-sm">Published</label></div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 font-medium" disabled={isSubmittingDua}>Cancel</button>
        <button type="submit" disabled={isSubmittingDua} className="bg-amber-600 text-white rounded font-medium px-6 py-2">Save Dua</button>
      </div>
    </form>
  );
}
