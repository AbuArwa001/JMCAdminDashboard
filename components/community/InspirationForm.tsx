import { useState } from "react";
import api from "@/lib/api";

interface Props {
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

export function InspirationForm({ onSuccess, isSubmitting, setIsSubmitting }: Props) {
  const [formData, setFormData] = useState({ content_type: "INSPIRATION", title: "", body: "", author_or_sheikh: "", is_published: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/v1/community/content/", formData);
      setFormData({ content_type: "INSPIRATION", title: "", body: "", author_or_sheikh: "", is_published: true });
      onSuccess();
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-semibold mb-4">Create New Inspiration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" required className="w-full p-2 border rounded" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Reference / Author</label><input type="text" required className="w-full p-2 border rounded" value={formData.author_or_sheikh} onChange={(e) => setFormData({ ...formData, author_or_sheikh: e.target.value })} /></div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Content (Ayah/Hadith text)</label><textarea required rows={4} className="w-full p-2 border rounded" value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} /></div>
        <div className="flex items-center"><input type="checkbox" id="is_published_insp" className="h-4 w-4" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} /><label htmlFor="is_published_insp" className="ml-2 block text-sm">Publish immediately</label></div>
        <div className="flex justify-end pt-2"><button type="submit" disabled={isSubmitting} className="bg-gray-900 text-white rounded-md font-medium px-6 py-2 disabled:cursor-not-allowed">Save Inspiration</button></div>
      </form>
    </div>
  );
}

