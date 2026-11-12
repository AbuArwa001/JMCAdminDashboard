import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Upload, X, Save } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

export function BulletinForm({ onClose, onSuccess, isSubmitting, setIsSubmitting }: Props) {
  const [form, setForm] = useState({ title: "", issue_number: "", published_date: format(new Date(), "yyyy-MM-dd"), is_active: true });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { toast.error("Please upload the PDF file."); return; }
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("title", form.title);
      if (form.issue_number) data.append("issue_number", form.issue_number);
      data.append("published_date", form.published_date);
      data.append("is_active", form.is_active ? "true" : "false");
      data.append("pdf_file", pdfFile);
      if (coverPhoto) data.append("cover_image", coverPhoto);
      await api.post("/api/v1/bulletins/", data, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Bulletin uploaded successfully.");
      onSuccess();
    } catch { toast.error("Failed to upload bulletin."); } finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center"><Upload className="w-4 h-4 text-blue-600" /></div>
        <div><h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Upload New Bulletin</h3><p className="text-[11px] text-gray-400">Select the PDF file and enter details.</p></div>
      </div>
      <div className="form-section-body space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2"><label className="form-label">Title *</label><input required type="text" className="form-input" placeholder="The Friday Bulletin 1212" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="form-label">Issue Number</label><input type="text" className="form-input" placeholder="e.g. 1212" value={form.issue_number} onChange={(e) => setForm({ ...form, issue_number: e.target.value })} /></div>
          <div><label className="form-label">Published Date *</label><input required type="date" className="form-input" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="form-label">Bulletin PDF File *</label>
            <label className="flex items-center justify-center gap-3 px-4 py-8 bg-gray-50 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-xl cursor-pointer">
              <Upload className="w-6 h-6 text-blue-400" /><span className="text-sm text-gray-600 font-medium">{pdfFile ? pdfFile.name : "Click to select PDF"}</span>
              <input type="file" accept="application/pdf" required className="hidden" onChange={(e) => { const f = e.target.files?.[0] || null; if (f && f.type !== "application/pdf") { toast.error("Please select a PDF file."); return; } setPdfFile(f); }} />
            </label>
          </div>
          <div><label className="form-label">Cover Thumbnail (Optional)</label>
            {coverPhotoPreview ? (
              <div className="relative inline-block"><Image src={coverPhotoPreview} alt="Cover preview" width={80} height={120} className="w-20 h-28 rounded-xl object-cover border-2 border-gray-200" /><button type="button" onClick={() => { setCoverPhoto(null); setCoverPhotoPreview(null); }} className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-full"><X className="w-3 h-3" /></button></div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 h-28 px-4 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl cursor-pointer"><Upload className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-500">Upload Cover Image</span><input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0] || null; setCoverPhoto(f); setCoverPhotoPreview(f ? URL.createObjectURL(f) : null); }} /></label>
            )}
          </div>
          <div className="flex items-center pb-1"><div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl w-full h-full"><label className="relative cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="peer sr-only" /><div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#006838] relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" /></label><div><span className="text-sm font-bold text-gray-800">Active</span><p className="text-xs text-gray-500">Visible to app users</p></div></div></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" disabled={isSubmitting} className="btn-primary bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed"><Save className="w-4 h-4 mr-2" />Upload Bulletin</button></div>
      </div>
    </form>
  );
}

