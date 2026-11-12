import { useState } from "react";
import { format } from "date-fns";
import { Mic, FileText } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { KhutbaPhotoInput } from "./KhutbaPhotoInput";

interface Props {
  initial?: any;
  onClose: () => void;
  onSuccess: () => void;
  setIsSubmitting: (b: boolean) => void;
  isSubmitting: boolean;
}

export function KhutbaFormModal({ initial, onClose, onSuccess, setIsSubmitting, isSubmitting }: Props) {
  const [form, setForm] = useState(initial || {
    title: "", topic_summary: "", khutba_date: format(new Date(), "yyyy-MM-dd"),
    khutba_time: "13:00", imam_name: "", published: true,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial?.imam_photo || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach((k) => { if (form[k] !== null && form[k] !== "") data.append(k, form[k]); });
      if (photo) data.append("imam_photo", photo);
      const url = form.id ? `/api/v1/khutba/${form.id}/` : "/api/v1/khutba/";
      await api[form.id ? "patch" : "post"](url, data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Khutba ${form.id ? "updated" : "created"} successfully.`);
      onSuccess();
    } catch { toast.error("Failed to save khutba."); } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
          <Mic className="w-4 h-4 text-[#c99335]" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>{form.id ? "Edit Khutba" : "New Friday Khutba"}</h3>
          <p className="text-[11px] text-gray-400">Enter the sermon details</p>
        </div>
      </div>
      <div className="form-section-body space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="form-label">Title *</label>
            <input required type="text" className="form-input" placeholder="e.g. The Importance of Tawakkul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div><label className="form-label">Imam Name *</label><input required type="text" className="form-input" placeholder="Sheikh Umar Hassan" value={form.imam_name} onChange={(e) => setForm({ ...form, imam_name: e.target.value })} /></div>
          <div><label className="form-label">Date *</label><input required type="date" className="form-input" value={form.khutba_date} onChange={(e) => setForm({ ...form, khutba_date: e.target.value })} /></div>
          <div><label className="form-label">Time *</label><input required type="time" className="form-input" value={form.khutba_time} onChange={(e) => setForm({ ...form, khutba_time: e.target.value })} /></div>
          <KhutbaPhotoInput photoPreview={photoPreview} onPhotoChange={(e) => { const f = e.target.files?.[0] || null; setPhoto(f); setPhotoPreview(f ? URL.createObjectURL(f) : null); }} onClear={() => { setPhoto(null); setPhotoPreview(null); }} />
          <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <label className="relative cursor-pointer flex-shrink-0">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="peer sr-only" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#006838] relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <div><span className="text-sm font-bold text-gray-800">Published</span><p className="text-xs text-gray-500">Visible to app users</p></div>
          </div>
        </div>
        <div>
          <label className="form-label">Topic Summary (Markdown)</label>
          <RichTextEditor value={form.topic_summary} onChange={(val) => setForm({ ...form, topic_summary: val })} placeholder="Topic summary and Quranic references..." minHeight={200} />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:cursor-not-allowed"><FileText className="w-4 h-4 mr-2" />{form.id ? "Update Khutba" : "Save Khutba"}</button>
        </div>
      </div>
    </form>
  );
}

