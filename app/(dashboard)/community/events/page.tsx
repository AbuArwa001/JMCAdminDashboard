"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Edit, Bell, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import RichTextEditor from "@/components/RichTextEditor";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    title: "", category: "", story: "", event_date: format(new Date(), "yyyy-MM-dd"), start_time: "10:00", end_time: "", venue_name: "", venue_address: "", venue_map_link: "", guest_name: "", published: true
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [guestPhoto, setGuestPhoto] = useState<File | null>(null);
  
  const [galleryEvent, setGalleryEvent] = useState<any>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryCaption, setGalleryCaption] = useState("");
  
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async () => {
    const prompt = window.prompt("What should the event story be about? (e.g. Write an engaging description for a Hajj preparation lecture)");
    if (!prompt) return;

    try {
      setIsGeneratingAI(true);
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate text");
      }

      setForm((prev: any) => ({ ...prev, story: data.content }));
    } catch (error: any) {
      alert("AI Generation failed: " + error.message);
      console.error(error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eRes, cRes] = await Promise.all([
        api.get("/api/v1/events/"),
        api.get("/api/v1/events/categories/")
      ]);
      setEvents(eRes.data.results || eRes.data);
      setCategories(cRes.data.results || cRes.data);
    } catch (error) {
      console.error("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      if (coverImage) formData.append("cover_image", coverImage);
      if (guestPhoto) formData.append("guest_photo", guestPhoto);
      
      if (form.id) {
        await api.patch(`/api/v1/events/${form.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post("/api/v1/events/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      setShowForm(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving event", error);
    }
  };

  const resetForm = () => {
    setForm({ title: "", category: "", story: "", event_date: format(new Date(), "yyyy-MM-dd"), start_time: "10:00", end_time: "", venue_name: "", venue_address: "", venue_map_link: "", guest_name: "", published: true });
    setCoverImage(null);
    setGuestPhoto(null);
  };

  const deleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await api.delete(`/api/v1/events/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  const notifyEvent = async (id: number) => {
    if (!confirm("Are you sure you want to send a push notification to all devices for this event?")) return;
    try {
      const res = await api.post(`/api/v1/events/${id}/notify/`);
      if (res.data.status === "No devices registered") {
        alert("Cannot send notification: No devices or users have registered for push notifications yet.");
      } else {
        alert(`Notification sent! Delivered to ${res.data.success_count || 0} devices. Failed: ${res.data.failure_count || 0}`);
      }
    } catch (error) {
      console.error("Error sending notification", error);
      alert("Failed to send notification.");
    }
  };
  
  const saveGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile || !galleryEvent) return;
    try {
      const formData = new FormData();
      formData.append("event", galleryEvent.id);
      formData.append("image", galleryFile);
      if (galleryCaption) formData.append("caption", galleryCaption);
      
      await api.post("/api/v1/events/images/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      setGalleryFile(null);
      setGalleryCaption("");
      fetchData();
      
      const updatedEvent = (await api.get(`/api/v1/events/${galleryEvent.id}/`)).data;
      setGalleryEvent(updatedEvent);
    } catch (error) {
      console.error("Error saving gallery image", error);
    }
  };
  
  const deleteGalleryImage = async (id: number) => {
    try {
      await api.delete(`/api/v1/events/images/${id}/`);
      fetchData();
      const updatedEvent = (await api.get(`/api/v1/events/${galleryEvent.id}/`)).data;
      setGalleryEvent(updatedEvent);
    } catch (error) {
      console.error("Error deleting image", error);
    }
  }

  if (loading) return <div className="p-6">Loading Events...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-gray-500">Manage mosque events, lectures, and gallery.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-amber-700">
          <Plus className="w-4 h-4"/> {showForm ? "Cancel" : "Add Event"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={saveEvent} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Event" : "New Event"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input required type="text" className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full p-2 border rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input required type="date" className="w-full p-2 border rounded" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input required type="time" className="w-full p-2 border rounded" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time (Optional)</label>
              <input type="time" className="w-full p-2 border rounded" value={form.end_time || ""} onChange={e => setForm({...form, end_time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Venue Name</label>
              <input required type="text" className="w-full p-2 border rounded" value={form.venue_name} onChange={e => setForm({...form, venue_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guest Name (Optional)</label>
              <input type="text" className="w-full p-2 border rounded" value={form.guest_name || ""} onChange={e => setForm({...form, guest_name: e.target.value})} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">Story / Rich Details</label>
                <button 
                  type="button" 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md flex items-center gap-1.5 font-medium transition-colors"
                >
                  {isGeneratingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isGeneratingAI ? "Generating..." : "Generate with AI"}
                </button>
              </div>
              <RichTextEditor 
                value={form.story || ""} 
                onChange={content => setForm({...form, story: content})} 
                placeholder="Enter event details or generate with AI..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={e => setCoverImage(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guest Photo</label>
              <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={e => setGuestPhoto(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2 flex items-center pt-2">
              <input type="checkbox" id="published" className="h-4 w-4 text-amber-600 rounded" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
              <label htmlFor="published" className="ml-2 block text-sm">Published</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 font-medium">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded font-medium hover:bg-gray-800">Save Event</button>
          </div>
        </form>
      )}

      {galleryEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gallery: {galleryEvent.title}</h2>
              <button onClick={() => setGalleryEvent(null)} className="text-gray-500 hover:text-gray-900 font-bold">Close</button>
            </div>
            
            <form onSubmit={saveGalleryImage} className="bg-slate-50 p-4 rounded border border-slate-200 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input required type="file" accept="image/*" className="w-full p-2 border rounded bg-white" onChange={e => setGalleryFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Caption (Optional)</label>
                <input type="text" className="w-full p-2 border rounded bg-white" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} />
              </div>
              <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700">Upload</button>
            </form>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryEvent.gallery_images?.map((img: any) => (
                <div key={img.id} className="relative group rounded overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex flex-col justify-between">
                  <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteGalleryImage(img.id)} className="p-1 bg-white/80 rounded text-red-600 hover:bg-white"><Trash className="w-4 h-4"/></button>
                  </div>
                  <div className="relative flex-1">
                    <Image src={img.image} alt={img.caption || ""} fill className="object-cover" />
                  </div>
                  {img.caption && <div className="p-1 text-xs text-center truncate bg-white">{img.caption}</div>}
                </div>
              ))}
              {(!galleryEvent.gallery_images || galleryEvent.gallery_images.length === 0) && (
                <div className="col-span-full py-8 text-center text-gray-500 text-sm">No images in gallery yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Venue</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((ev) => (
              <tr key={ev.id}>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{ev.title}</div>
                  <div className="text-sm text-gray-500">{ev.category_name || 'General'} • Guest: {ev.guest_name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium">{format(new Date(ev.event_date), "MMM d, yyyy")} at {ev.start_time}</div>
                  <div className="text-sm text-gray-500">{ev.venue_name}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ev.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {ev.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3 text-sm">
                  <button onClick={() => setGalleryEvent(ev)} className="text-indigo-600 hover:text-indigo-900" title="Gallery"><ImageIcon className="w-4 h-4 inline"/></button>
                  <button onClick={() => notifyEvent(ev.id)} className="text-amber-600 hover:text-amber-900" title="Send Push Notification"><Bell className="w-4 h-4 inline"/></button>
                  <button onClick={() => { setForm({ ...ev, category: ev.category || "" }); setShowForm(true); }} className="text-gray-400 hover:text-gray-900"><Edit className="w-4 h-4 inline"/></button>
                  <button onClick={() => deleteEvent(ev.id)} className="text-gray-400 hover:text-red-600"><Trash className="w-4 h-4 inline"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
