import { useState } from "react";
import { BookOpen, FileText } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";

interface Props {
  initial?: any;
  onClose: () => void;
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

export function DarsaForm({ initial, onClose, onSuccess, isSubmitting, setIsSubmitting }: Props) {
  const [form, setForm] = useState(initial || { content_type: "DARSA", title: "", body: "", author_or_sheikh: "", scheduled_for: "", is_published: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (form.id) {
        await api.patch(`/api/v1/community/content/${form.id}/`, form);
        toast.success("Darsa updated.");
      } else {
        await api.post("/api/v1/community/content/", form);
        toast.success("Darsa created.");
      }
      onSuccess();
    } catch { toast.error("Failed to save darsa."); } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center"><BookOpen className="w-4 h-4 text-teal-400" /></div>
        <div><h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>{form.id ? "Edit Darsa" : "New Darsa"}</h3><p className="text-[11px] text-gray-400">Fill in the class details below</p></div>
      </div>
      <div className="form-section-body space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><label className="form-label">Title *</label><input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" placeholder="Tafsir Al-Baqarah" /></div>
          <div><label className="form-label">Sheikh / Teacher *</label><input type="text" required value={form.author_or_sheikh} onChange={(e) => setForm({ ...form, author_or_sheikh: e.target.value })} className="form-input" placeholder="Sheikh Ahmad" /></div>
          <div><label className="form-label">Scheduled Date & Time</label><input type="datetime-local" value={form.scheduled_for || ""} onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })} className="form-input" /></div>
          <div className="flex items-end pb-1"><div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl w-full"><label className="relative cursor-pointer"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="peer sr-only" /><div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#006838] relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" /></label><div><span className="text-sm font-bold text-gray-800">Publish Immediately</span><p className="text-xs text-gray-500">Visible to users</p></div></div></div>
        </div>
        <div><label className="form-label">Description / Topic Details</label><RichTextEditor value={form.body || ""} onChange={(val) => setForm({ ...form, body: val })} placeholder="Describe the darsa topic..." minHeight={200} /></div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100"><button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>Cancel</button><button type="submit" disabled={isSubmitting} className="btn-primary disabled:cursor-not-allowed"><FileText className="w-4 h-4 mr-2" />{form.id ? "Update Darsa" : "Save Darsa"}</button></div>
      </div>
    </form>
  );
}
