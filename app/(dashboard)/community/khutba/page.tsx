"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Edit, Bell, FileText, History, Mic, Upload, X } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";

export default function KhutbaPage() {
  const [khutbas, setKhutbas] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"khutbas" | "logs">("khutbas");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    topic_summary: "",
    khutba_date: format(new Date(), "yyyy-MM-dd"),
    khutba_time: "13:00",
    imam_name: "",
    published: true,
  });
  const [imamPhoto, setImamPhoto] = useState<File | null>(null);
  const [imamPhotoPreview, setImamPhotoPreview] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kRes, lRes] = await Promise.all([
        api.get("/api/v1/khutba/"),
        api.get("/api/v1/khutba/logs/"),
      ]);
      setKhutbas(kRes.data.results || kRes.data);
      setLogs(lRes.data.results || lRes.data);
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      topic_summary: "",
      khutba_date: format(new Date(), "yyyy-MM-dd"),
      khutba_time: "13:00",
      imam_name: "",
      published: true,
    });
    setImamPhoto(null);
    setImamPhotoPreview(null);
  };

  const saveKhutba = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      if (imamPhoto) formData.append("imam_photo", imamPhoto);

      if (form.id) {
        await api.patch(`/api/v1/khutba/${form.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Khutba updated successfully.");
      } else {
        await api.post("/api/v1/khutba/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Khutba created successfully.");
      }
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving khutba", error);
      toast.error("Failed to save khutba.");
    }
  };

  const deleteKhutba = async (id: number) => {
    if (!confirm("Delete this Khutba entry?")) return;
    try {
      await api.delete(`/api/v1/khutba/${id}/`);
      toast.success("Khutba deleted.");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete khutba.");
    }
  };

  const notifyKhutba = async (id: number) => {
    if (!confirm("Send push notification to all devices for this Khutba?")) return;
    try {
      const res = await api.post(`/api/v1/khutba/${id}/notify/`);
      if (res.data.status === "No devices registered") {
        toast.warning("No devices registered for push notifications.");
      } else {
        toast.success(`Notification sent to ${res.data.success_count || 0} devices.`);
      }
      fetchData();
    } catch (error) {
      toast.error("Failed to send notification.");
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImamPhoto(file);
    if (file) {
      setImamPhotoPreview(URL.createObjectURL(file));
    } else {
      setImamPhotoPreview(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
          <Mic className="w-5 h-5 text-[#c99335]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Friday Khutba
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Manage weekly Juma Khutba topics and send push notifications.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex items-center gap-1">
        {[
          { id: "khutbas", label: "Khutbas", icon: FileText },
          { id: "logs", label: "Notification History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                isActive
                  ? "border-[#c99335] text-[#1a1512]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Khutbas Tab */}
      {activeTab === "khutbas" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Khutba Schedule</h2>
            <button
              onClick={() => { resetForm(); setShowForm(!showForm); }}
              className={showForm ? "btn-secondary" : "btn-primary"}
            >
              {showForm ? <><span>✕</span> Cancel</> : <><Plus className="w-4 h-4" /> Add Khutba</>}
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
                <form onSubmit={saveKhutba} className="form-section">
                  <div className="form-section-header">
                    <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
                      <Mic className="w-4 h-4 text-[#c99335]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                        {form.id ? "Edit Khutba" : "New Friday Khutba"}
                      </h3>
                      <p className="text-[11px] text-gray-400">Enter the sermon details</p>
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
                          placeholder="e.g. The Importance of Tawakkul"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                      </div>

                      {/* Imam Name */}
                      <div>
                        <label className="form-label">Imam Name <span className="text-rose-500 normal-case font-bold">*</span></label>
                        <input
                          required
                          type="text"
                          className="form-input"
                          placeholder="e.g. Sheikh Umar Hassan"
                          value={form.imam_name}
                          onChange={(e) => setForm({ ...form, imam_name: e.target.value })}
                        />
                      </div>

                      {/* Date */}
                      <div>
                        <label className="form-label">Date <span className="text-rose-500 normal-case font-bold">*</span></label>
                        <input
                          required
                          type="date"
                          className="form-input"
                          value={form.khutba_date}
                          onChange={(e) => setForm({ ...form, khutba_date: e.target.value })}
                        />
                      </div>

                      {/* Time */}
                      <div>
                        <label className="form-label">Time <span className="text-rose-500 normal-case font-bold">*</span></label>
                        <input
                          required
                          type="time"
                          className="form-input"
                          value={form.khutba_time}
                          onChange={(e) => setForm({ ...form, khutba_time: e.target.value })}
                        />
                      </div>

                      {/* Imam Photo Upload */}
                      <div>
                        <label className="form-label">Imam Photo (Optional)</label>
                        {imamPhotoPreview ? (
                          <div className="relative inline-block">
                            <Image
                              src={imamPhotoPreview}
                              alt="Imam photo preview"
                              width={80}
                              height={80}
                              className="w-20 h-20 rounded-xl object-cover border-2 border-[#c99335]/30"
                            />
                            <button
                              type="button"
                              onClick={() => { setImamPhoto(null); setImamPhotoPreview(null); }}
                              className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-full shadow-md"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#c99335]/40 rounded-xl cursor-pointer transition-colors group">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#c99335] transition-colors" />
                            <span className="text-sm text-gray-500 font-medium">Click to upload photo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                          </label>
                        )}
                      </div>

                      {/* Published */}
                      <div className="flex items-end pb-1">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl w-full">
                          <label className="relative cursor-pointer flex-shrink-0">
                            <input
                              type="checkbox"
                              id="published"
                              checked={form.published}
                              onChange={(e) => setForm({ ...form, published: e.target.checked })}
                              className="peer sr-only"
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:border-white" />
                          </label>
                          <div>
                            <span className="text-sm font-bold text-gray-800">Published</span>
                            <p className="text-xs text-gray-500 mt-0.5">Visible to app users</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Topic Summary — Rich Text */}
                    <div>
                      <label className="form-label">Topic Summary</label>
                      <RichTextEditor
                        value={form.topic_summary}
                        onChange={(val) => setForm({ ...form, topic_summary: val })}
                        placeholder="Describe the khutba topic, key Quranic verses, hadith references, and main points..."
                        minHeight={220}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        <FileText className="w-4 h-4" />
                        {form.id ? "Update Khutba" : "Save Khutba"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Khutba Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400 font-medium">Loading Khutbas...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <th className="px-6 py-4 border-b border-gray-100">Khutba</th>
                      <th className="px-6 py-4 border-b border-gray-100">Imam</th>
                      <th className="px-6 py-4 border-b border-gray-100">Date & Time</th>
                      <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
                      <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {khutbas.map((k) => (
                      <tr key={k.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-[#006838] transition-colors">{k.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-xs mt-0.5" dangerouslySetInnerHTML={{ __html: k.topic_summary?.replace(/<[^>]*>/g, "") || "" }} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {k.imam_photo && (
                              <Image src={k.imam_photo} alt={k.imam_name} width={28} height={28} className="rounded-lg object-cover border border-gray-200" />
                            )}
                            <span className="text-sm font-medium text-gray-700">{k.imam_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-800">{format(new Date(k.khutba_date), "MMM d, yyyy")}</p>
                          <p className="text-xs text-gray-500 font-mono">{k.khutba_time}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={k.published ? "badge-emerald" : "px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 rounded-full"}>
                            {k.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => notifyKhutba(k.id)}
                              className="p-1.5 text-[#c99335] hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-colors"
                              title="Send Push Notification"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setForm(k); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              className="p-1.5 text-gray-400 hover:text-[#006838] hover:bg-emerald-50 rounded-lg border border-transparent hover:border-emerald-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteKhutba(k.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {khutbas.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mic className="w-6 h-6 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-medium">No khutbas found</p>
                          <p className="text-xs text-gray-400 mt-1">Add your first khutba entry above</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Logs Tab */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Push Notification History</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    <th className="px-6 py-4 border-b border-gray-100">Notification Content</th>
                    <th className="px-6 py-4 border-b border-gray-100">Sent At</th>
                    <th className="px-6 py-4 border-b border-gray-100">Type</th>
                    <th className="px-6 py-4 border-b border-gray-100 text-center">Recipients</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{log.title}</p>
                        <p className="text-xs text-gray-500 max-w-md">{log.body}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {format(new Date(log.sent_at), "MMM d, yyyy HH:mm")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-gold capitalize">
                          {log.related_event ? "Event" : log.related_khutba ? "Khutba" : "Other"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="badge-emerald">{log.recipient_count}</span>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                        No notifications sent yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
