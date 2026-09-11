"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Newspaper, Upload, X, Save, Bell } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function BulletinsPage() {
  const [bulletins, setBulletins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    title: "",
    issue_number: "",
    published_date: format(new Date(), "yyyy-MM-dd"),
    is_active: true,
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/bulletins/");
      setBulletins(res.data.results || res.data);
    } catch (error) {
      console.error("Error fetching bulletins", error);
      toast.error("Failed to load bulletins");
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyBulletin = async (id: number) => {
    try {
      setNotifyingId(id);
      await api.post(`/api/v1/bulletins/${id}/notify`);
      toast.success("Push notification broadcasted to all users successfully!");
    } catch (error) {
      console.error("Error broadcasting bulletin notification", error);
      toast.error("Failed to send push notification.");
    } finally {
      setNotifyingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      issue_number: "",
      published_date: format(new Date(), "yyyy-MM-dd"),
      is_active: true,
    });
    setPdfFile(null);
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
  };

  const saveBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error("Please upload the PDF file.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", form.title);
      if (form.issue_number) formData.append("issue_number", form.issue_number);
      formData.append("published_date", form.published_date);
      formData.append("is_active", form.is_active ? "true" : "false");
      formData.append("pdf_file", pdfFile);
      
      if (coverPhoto) {
        formData.append("cover_image", coverPhoto);
      }

      await api.post("/api/v1/bulletins/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Bulletin uploaded successfully.");
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving bulletin", error);
      toast.error("Failed to upload bulletin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBulletin = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bulletin?")) return;
    try {
      await api.delete(`/api/v1/bulletins/${id}`);
      toast.success("Bulletin deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete bulletin.");
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverPhoto(file);
    if (file) {
      setCoverPhotoPreview(URL.createObjectURL(file));
    } else {
      setCoverPhotoPreview(null);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file.");
      return;
    }
    setPdfFile(file);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center shadow-md">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              Friday Bulletins
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Upload and manage weekly Friday Bulletins for the mobile app.
            </p>
          </div>
        </div>
        
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className={showForm ? "btn-secondary" : "btn-primary bg-blue-600 hover:bg-blue-700"}
        >
          {showForm ? <><span>✕</span> Cancel</> : <><Plus className="w-4 h-4" /> Upload Bulletin</>}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={saveBulletin} className="form-section">
              <div className="form-section-header">
                <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    Upload New Bulletin
                  </h3>
                  <p className="text-[11px] text-gray-400">Select the PDF file and enter details.</p>
                </div>
              </div>

              <div className="form-section-body space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="form-label">Title <span className="text-rose-500 normal-case font-bold">*</span></label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      placeholder="e.g. The Friday Bulletin 1212"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  {/* Issue Number */}
                  <div>
                    <label className="form-label">Issue Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 1212"
                      value={form.issue_number}
                      onChange={(e) => setForm({ ...form, issue_number: e.target.value })}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="form-label">Published Date <span className="text-rose-500 normal-case font-bold">*</span></label>
                    <input
                      required
                      type="date"
                      className="form-input"
                      value={form.published_date}
                      onChange={(e) => setForm({ ...form, published_date: e.target.value })}
                    />
                  </div>

                  {/* PDF Upload */}
                  <div className="md:col-span-2">
                    <label className="form-label">Bulletin PDF File <span className="text-rose-500 normal-case font-bold">*</span></label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center gap-3 px-4 py-8 bg-gray-50 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                        <Upload className="w-6 h-6 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-sm text-gray-600 font-medium group-hover:text-blue-700">
                          {pdfFile ? pdfFile.name : "Click to select PDF"}
                        </span>
                        <input type="file" accept="application/pdf" required className="hidden" onChange={handlePdfChange} />
                      </label>
                    </div>
                  </div>

                  {/* Cover Photo Upload */}
                  <div>
                    <label className="form-label">Cover Thumbnail (Optional)</label>
                    {coverPhotoPreview ? (
                      <div className="relative inline-block">
                        <Image
                          src={coverPhotoPreview}
                          alt="Cover preview"
                          width={80}
                          height={120}
                          className="w-20 h-28 rounded-xl object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => { setCoverPhoto(null); setCoverPhotoPreview(null); }}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-full shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 h-28 px-4 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors group">
                        <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-xs text-gray-500 font-medium text-center">Upload Cover Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                      </label>
                    )}
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center pb-1">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl w-full h-full">
                      <label className="relative cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={form.is_active}
                          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:border-white" />
                      </label>
                      <div>
                        <span className="text-sm font-bold text-gray-800">Active</span>
                        <p className="text-xs text-gray-500 mt-0.5">Visible to app users</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn-primary bg-blue-600 hover:bg-blue-700 disabled:opacity-70">
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Uploading..." : "Upload Bulletin"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulletins Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-medium">Loading Bulletins...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <th className="px-6 py-4 border-b border-gray-100">Cover</th>
                  <th className="px-6 py-4 border-b border-gray-100">Title</th>
                  <th className="px-6 py-4 border-b border-gray-100">Issue</th>
                  <th className="px-6 py-4 border-b border-gray-100">Published</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bulletins.map((b) => (
                  <tr key={b.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {b.cover_image_path ? (
                        <div className="w-12 h-16 relative rounded overflow-hidden shadow-sm border border-gray-200">
                          <Image src={b.cover_image_path.startsWith('http') ? b.cover_image_path : process.env.NEXT_PUBLIC_API_URL + b.cover_image_path} alt="Cover" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                          <Newspaper className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{b.title}</p>
                      <a href={b.pdf_path.startsWith('http') ? b.pdf_path : process.env.NEXT_PUBLIC_API_URL + b.pdf_path} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-0.5 inline-block">View PDF</a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{b.issue_number || "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-800">{format(new Date(b.published_date), "MMM d, yyyy")}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={b.is_active ? "badge-emerald" : "px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 rounded-full"}>
                        {b.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleNotifyBulletin(b.id)}
                          disabled={notifyingId === b.id}
                          title="Broadcast Push Notification"
                          className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition-colors disabled:opacity-50"
                        >
                          <Bell className={`w-4 h-4 ${notifyingId === b.id ? "animate-spin" : ""}`} />
                        </button>
                        <button
                          onClick={() => deleteBulletin(b.id)}
                          title="Delete Bulletin"
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bulletins.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Newspaper className="w-6 h-6 text-blue-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No bulletins uploaded yet</p>
                      <p className="text-xs text-gray-400 mt-1">Upload the first Friday Bulletin above</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
