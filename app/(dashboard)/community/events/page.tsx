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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1">Mosque Events</h1>
          <p className="text-gray-500 font-medium">Manage and broadcast mosque events to the community.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(!showForm); }} 
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300"
        >
          <Plus className="w-5 h-5"/> {showForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={saveEvent} className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{form.id ? "Edit Event Details" : "New Event Details"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Title</label>
              <input required type="text" className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Weekly Tafseer" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
              <input required type="date" className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
              <input required type="time" className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time (Optional)</label>
              <input type="time" className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.end_time || ""} onChange={e => setForm({...form, end_time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Venue Name</label>
              <input required type="text" className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.venue_name} onChange={e => setForm({...form, venue_name: e.target.value})} placeholder="e.g. Main Prayer Hall" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Guest Speaker (Optional)</label>
              <input type="text" className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" value={form.guest_name || ""} onChange={e => setForm({...form, guest_name: e.target.value})} placeholder="e.g. Mufti Menk" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700">Story / Rich Details (Markdown)</label>
                <button 
                  type="button" 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg flex items-center gap-1.5 font-bold transition-colors border border-amber-200"
                >
                  {isGeneratingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isGeneratingAI ? "Generating..." : "Generate with AI"}
                </button>
              </div>
              <RichTextEditor 
                value={form.story || ""} 
                onChange={content => setForm({...form, story: content})} 
                placeholder="Write your event description using Markdown here..." 
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
              <input type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" onChange={e => setCoverImage(e.target.files?.[0] || null)} />
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guest Photo (Optional)</label>
              <input type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setGuestPhoto(e.target.files?.[0] || null)} />
            </div>
            <div className="md:col-span-2 flex items-center p-4 bg-green-50/50 rounded-xl border border-green-100">
              <input type="checkbox" id="published" className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
              <label htmlFor="published" className="ml-3 block text-sm font-semibold text-green-800">Publish Immediately</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-lg transition-all">Save Event</button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div key={ev.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative">
            <div className="h-48 bg-gray-100 relative">
              {ev.cover_image ? (
                <Image src={ev.cover_image} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-amber-300" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-sm ${ev.published ? 'bg-green-500/90 text-white' : 'bg-white/90 text-gray-800'}`}>
                  {ev.published ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">{ev.category_name || 'General Event'}</div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-amber-600 transition-colors">{ev.title}</h3>
              
              <div className="space-y-2 mt-auto">
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <div className="w-5 flex justify-center mr-2 opacity-50">📅</div>
                  {format(new Date(ev.event_date), "MMMM d, yyyy")} @ {ev.start_time}
                </div>
                <div className="flex items-center text-sm text-gray-600 font-medium">
                  <div className="w-5 flex justify-center mr-2 opacity-50">📍</div>
                  {ev.venue_name}
                </div>
                {ev.guest_name && (
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <div className="w-5 flex justify-center mr-2 opacity-50">🎙️</div>
                    {ev.guest_name}
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center gap-2">
              <button onClick={() => setGalleryEvent(ev)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
                <ImageIcon className="w-4 h-4" /> Gallery
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => notifyEvent(ev.id)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors" title="Send Push Notification">
                  <Bell className="w-4 h-4" />
                </button>
                <button onClick={() => { setForm({ ...ev, category: ev.category || "" }); setShowForm(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteEvent(ev.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
