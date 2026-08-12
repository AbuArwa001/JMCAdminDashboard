"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Edit, Bell, FileText, History } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

export default function KhutbaPage() {
  const [khutbas, setKhutbas] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"khutbas" | "logs">("khutbas");
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    title: "", topic_summary: "", khutba_date: format(new Date(), "yyyy-MM-dd"), khutba_time: "13:00", imam_name: "", published: true
  });
  
  const [imamPhoto, setImamPhoto] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kRes, lRes] = await Promise.all([
        api.get("/api/v1/khutba/"),
        api.get("/api/v1/khutba/logs/")
      ]);
      setKhutbas(kRes.data.results || kRes.data);
      setLogs(lRes.data.results || lRes.data);
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveKhutba = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      if (imamPhoto) formData.append("imam_photo", imamPhoto);
      
      if (form.id) {
        await api.patch(`/api/v1/khutba/${form.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post("/api/v1/khutba/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving khutba", error);
    }
  };

  const resetForm = () => {
    setForm({ title: "", topic_summary: "", khutba_date: format(new Date(), "yyyy-MM-dd"), khutba_time: "13:00", imam_name: "", published: true });
    setImamPhoto(null);
  };

  const deleteKhutba = async (id: number) => {
    if (!confirm("Delete this Khutba entry?")) return;
    try {
      await api.delete(`/api/v1/khutba/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting khutba", error);
    }
  };

  const notifyKhutba = async (id: number) => {
    if (!confirm("Are you sure you want to send a push notification to all devices for this Khutba?")) return;
    try {
      const res = await api.post(`/api/v1/khutba/${id}/notify/`);
      if (res.data.status === "No devices registered") {
        alert("Cannot send notification: No devices or users have registered for push notifications yet.");
      } else {
        alert(`Notification sent! Delivered to ${res.data.success_count || 0} devices. Failed: ${res.data.failure_count || 0}`);
      }
      fetchData(); // refresh logs
    } catch (error) {
      console.error("Error sending notification", error);
      alert("Failed to send notification.");
    }
  };
  
  if (loading) return <div className="p-6">Loading Khutba...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Friday Khutba</h1>
        <p className="text-gray-500">Manage weekly Juma Khutba topics and send push notifications.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("khutbas")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'khutbas' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FileText className="w-5 h-5"/> Khutbas
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'logs' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <History className="w-5 h-5"/> Notification History
          </button>
        </nav>
      </div>

      {activeTab === "khutbas" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Khutba Schedule</h2>
            <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-amber-700">
              <Plus className="w-4 h-4"/> {showForm ? "Cancel" : "Add Khutba"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={saveKhutba} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Khutba" : "New Khutba"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input required type="text" className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Imam Name</label>
                  <input required type="text" className="w-full p-2 border rounded" value={form.imam_name} onChange={e => setForm({...form, imam_name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input required type="date" className="w-full p-2 border rounded" value={form.khutba_date} onChange={e => setForm({...form, khutba_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input required type="time" className="w-full p-2 border rounded" value={form.khutba_time} onChange={e => setForm({...form, khutba_time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Imam Photo (Optional)</label>
                  <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={e => setImamPhoto(e.target.files?.[0] || null)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Topic Summary</label>
                  <textarea required rows={4} className="w-full p-2 border rounded" value={form.topic_summary} onChange={e => setForm({...form, topic_summary: e.target.value})} />
                </div>
                <div className="md:col-span-2 flex items-center pt-2">
                  <input type="checkbox" id="published" className="h-4 w-4 text-amber-600 rounded" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
                  <label htmlFor="published" className="ml-2 block text-sm">Published</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded font-medium hover:bg-gray-800">Save</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khutba</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {khutbas.map((k) => (
                  <tr key={k.id}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{k.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{k.topic_summary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {k.imam_photo && <Image src={k.imam_photo} alt={k.imam_name} width={24} height={24} className="rounded-full object-cover" />}
                        <span className="text-sm font-medium">{k.imam_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{format(new Date(k.khutba_date), "MMM d, yyyy")}</div>
                      <div className="text-sm text-gray-500">{k.khutba_time}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${k.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {k.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 text-sm">
                      <button onClick={() => notifyKhutba(k.id)} className="text-amber-600 hover:text-amber-900" title="Send Push Notification"><Bell className="w-4 h-4 inline"/></button>
                      <button onClick={() => { setForm(k); setShowForm(true); }} className="text-gray-400 hover:text-gray-900"><Edit className="w-4 h-4 inline"/></button>
                      <button onClick={() => deleteKhutba(k.id)} className="text-gray-400 hover:text-red-600"><Trash className="w-4 h-4 inline"/></button>
                    </td>
                  </tr>
                ))}
                {khutbas.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No khutbas found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Push Notification Log</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notification Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Recipients</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{log.title}</div>
                      <div className="text-sm text-gray-500 max-w-md">{log.body}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(log.sent_at), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {log.related_event ? 'Event' : (log.related_khutba ? 'Khutba' : 'Other')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-green-600">
                      {log.recipient_count}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No notifications sent yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
