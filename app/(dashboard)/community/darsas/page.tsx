"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Edit, Bell, FileText, History, BookOpen, Search } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";

interface CommunityContent {
  id?: number;
  content_type: string;
  title: string;
  body: string;
  author_or_sheikh: string;
  scheduled_for: string;
  is_published: boolean;
}

export default function DarsasPage() {
  const [darsas, setDarsas] = useState<CommunityContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CommunityContent>>({
    content_type: "DARSA",
    title: "",
    body: "",
    author_or_sheikh: "",
    scheduled_for: "",
    is_published: true,
  });

  const fetchDarsas = async () => {
    try {
      const response = await api.get("/api/v1/community/content/?content_type=DARSA");
      setDarsas(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching darsas:", error);
      toast.error("Failed to load darsas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDarsas();
  }, []);

  const resetForm = () => {
    setFormData({ content_type: "DARSA", title: "", body: "", author_or_sheikh: "", scheduled_for: "", is_published: true });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/api/v1/community/content/${editingId}/`, formData);
        toast.success("Darsa updated successfully.");
      } else {
        await api.post("/api/v1/community/content/", formData);
        toast.success("Darsa created successfully.");
      }
      setShowForm(false);
      resetForm();
      fetchDarsas();
    } catch (error) {
      console.error("Error saving darsa:", error);
      toast.error("Failed to save darsa.");
    }
  };

  const togglePublish = async (darsa: CommunityContent) => {
    try {
      await api.patch(`/api/v1/community/content/${darsa.id}/`, { is_published: !darsa.is_published });
      fetchDarsas();
    } catch (error) {
      toast.error("Failed to update publish status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Darsa?")) return;
    try {
      await api.delete(`/api/v1/community/content/${id}/`);
      toast.success("Darsa deleted.");
      fetchDarsas();
    } catch (error) {
      toast.error("Failed to delete darsa.");
    }
  };

  const handleEdit = (darsa: CommunityContent) => {
    setFormData(darsa);
    setEditingId(darsa.id || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
              Darsas & Classes
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Manage Islamic learning sessions and class schedules.
            </p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className={showForm ? "btn-secondary" : "btn-primary"}
        >
          {showForm ? (
            <><span>✕</span> Cancel</>
          ) : (
            <><Plus className="w-4 h-4" /> Add Darsa</>
          )}
        </button>
      </div>

      {/* Create / Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="form-section">
              {/* Form Header */}
              <div className="form-section-header">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    {editingId ? "Edit Darsa" : "New Darsa"}
                  </h3>
                  <p className="text-[11px] text-gray-400">Fill in the class details below</p>
                </div>
              </div>

              <div className="form-section-body space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Title <span className="text-rose-500 normal-case font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Tafsir Al-Baqarah — Session 12"
                    />
                  </div>
                  <div>
                    <label className="form-label">Sheikh / Teacher <span className="text-rose-500 normal-case font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      value={formData.author_or_sheikh}
                      onChange={(e) => setFormData({ ...formData, author_or_sheikh: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Sheikh Ahmad Al-Nasser"
                    />
                  </div>
                  <div>
                    <label className="form-label">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl w-full">
                      <label className="relative cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          id="is_published_darsa"
                          checked={formData.is_published}
                          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:border-white" />
                      </label>
                      <div>
                        <span className="text-sm font-bold text-gray-800">Publish Immediately</span>
                        <p className="text-xs text-gray-500 mt-0.5">Visible to app users right away</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rich Text Body */}
                <div>
                  <label className="form-label">Description / Topic Details</label>
                  <RichTextEditor
                    value={formData.body || ""}
                    onChange={(val) => setFormData({ ...formData, body: val })}
                    placeholder="Describe the darsa topic, what will be covered, prerequisites..."
                    minHeight={220}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <FileText className="w-4 h-4" />
                    {editingId ? "Update Darsa" : "Save Darsa"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" />
            All Darsas
          </h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {darsas.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 font-medium">Loading darsas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  <th className="px-6 py-4 border-b border-gray-100">Title</th>
                  <th className="px-6 py-4 border-b border-gray-100">Sheikh</th>
                  <th className="px-6 py-4 border-b border-gray-100">Scheduled</th>
                  <th className="px-6 py-4 border-b border-gray-100">Status</th>
                  <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {darsas.map((darsa) => (
                  <tr key={darsa.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#006838] transition-colors">
                        {darsa.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-medium">{darsa.author_or_sheikh}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        {darsa.scheduled_for ? format(new Date(darsa.scheduled_for), "MMM d, yyyy HH:mm") : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={darsa.is_published ? "badge-emerald" : "px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 rounded-full"}>
                        {darsa.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => togglePublish(darsa)}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors
                            text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                        >
                          {darsa.is_published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleEdit(darsa)}
                          className="p-1.5 text-gray-400 hover:text-[#006838] hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-200 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(darsa.id!)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {darsas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-gray-500 font-medium">No darsas found</p>
                      <p className="text-xs text-gray-400 mt-1">Add your first darsa using the button above</p>
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
