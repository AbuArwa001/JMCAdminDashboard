"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Plus, Trash, Edit, Users, Music } from "lucide-react";
import Image from "next/image";

interface Reciter {
  id: number;
  name: string;
  bio: string;
  photo: string | null;
}

interface SurahAudio {
  id: number;
  surah_number: number;
  reciter: number;
  audio_url: string;
  duration_seconds: number | null;
}

export default function QuranPage() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [audios, setAudios] = useState<SurahAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reciters" | "audio">("reciters");

  // Reciter Form
  const [showReciterForm, setShowReciterForm] = useState(false);
  const [reciterForm, setReciterForm] = useState<{id?: number, name: string, bio: string, photo?: File | null}>({ name: "", bio: "" });

  // Audio Form
  const [showAudioForm, setShowAudioForm] = useState(false);
  const [audioForm, setAudioForm] = useState<Partial<SurahAudio>>({ surah_number: 1, reciter: 0, audio_url: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rRes, aRes] = await Promise.all([
        api.get("/api/v1/quran/reciters/"),
        api.get("/api/v1/quran/audio/")
      ]);
      setReciters(rRes.data.results || rRes.data);
      setAudios(aRes.data.results || aRes.data);
    } catch (error) {
      console.error("Error fetching quran data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const saveReciter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", reciterForm.name);
      formData.append("bio", reciterForm.bio);
      if (reciterForm.photo instanceof File) {
        formData.append("photo", reciterForm.photo);
      }

      if (reciterForm.id) {
        await api.patch(`/api/v1/quran/reciters/${reciterForm.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post("/api/v1/quran/reciters/", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowReciterForm(false);
      setReciterForm({ name: "", bio: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving reciter", error);
    }
  };

  const deleteReciter = async (id: number) => {
    if (!confirm("Delete this reciter? All related audios will be deleted too.")) return;
    try {
      await api.delete(`/api/v1/quran/reciters/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting reciter", error);
    }
  };

  const saveAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (audioForm.id) {
        await api.put(`/api/v1/quran/audio/${audioForm.id}/`, audioForm);
      } else {
        await api.post("/api/v1/quran/audio/", audioForm);
      }
      setShowAudioForm(false);
      setAudioForm({ surah_number: 1, reciter: reciters[0]?.id || 0, audio_url: "" });
      fetchData();
    } catch (error) {
      console.error("Error saving audio", error);
    }
  };

  const deleteAudio = async (id: number) => {
    if (!confirm("Delete this audio entry?")) return;
    try {
      await api.delete(`/api/v1/quran/audio/${id}/`);
      fetchData();
    } catch (error) {
      console.error("Error deleting audio", error);
    }
  };

  if (loading) return <div className="p-6">Loading Quran settings...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quran Management</h1>
        <p className="text-gray-500">Manage reciters and Surah audio files.</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("reciters")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'reciters' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Users className="w-5 h-5"/> Reciters
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'audio' ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Music className="w-5 h-5"/> Surah Audio
          </button>
        </nav>
      </div>

      {activeTab === "reciters" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Reciters</h2>
            <button onClick={() => { setReciterForm({ name: "", bio: "" }); setShowReciterForm(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-amber-700">
              <Plus className="w-4 h-4"/> Add Reciter
            </button>
          </div>

          {showReciterForm && (
            <form onSubmit={saveReciter} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-semibold mb-2">{reciterForm.id ? "Edit Reciter" : "New Reciter"}</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" className="w-full p-2 border rounded" value={reciterForm.name} onChange={e => setReciterForm({...reciterForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Biography</label>
                <textarea rows={3} className="w-full p-2 border rounded" value={reciterForm.bio} onChange={e => setReciterForm({...reciterForm, bio: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={e => setReciterForm({...reciterForm, photo: e.target.files?.[0] || null})} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowReciterForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded">Save</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reciters.map(reciter => (
              <div key={reciter.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative group">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded backdrop-blur">
                  <button onClick={() => { setReciterForm({ id: reciter.id, name: reciter.name, bio: reciter.bio }); setShowReciterForm(true); }} className="p-1 hover:text-amber-600"><Edit className="w-4 h-4"/></button>
                  <button onClick={() => deleteReciter(reciter.id)} className="p-1 hover:text-red-600"><Trash className="w-4 h-4"/></button>
                </div>
                <div className="aspect-square bg-gray-100 relative">
                  {reciter.photo ? (
                    <Image src={reciter.photo} alt={reciter.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Users className="w-16 h-16"/>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{reciter.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{reciter.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "audio" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Surah Audio Files</h2>
            <button onClick={() => { setAudioForm({ surah_number: 1, reciter: reciters[0]?.id || 0, audio_url: "" }); setShowAudioForm(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-amber-700">
              <Plus className="w-4 h-4"/> Assign Audio
            </button>
          </div>

          {showAudioForm && (
            <form onSubmit={saveAudio} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Surah Number (1-114)</label>
                  <input required type="number" min="1" max="114" className="w-full p-2 border rounded" value={audioForm.surah_number} onChange={e => setAudioForm({...audioForm, surah_number: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reciter</label>
                  <select required className="w-full p-2 border rounded" value={audioForm.reciter} onChange={e => setAudioForm({...audioForm, reciter: Number(e.target.value)})}>
                    <option value={0}>Select Reciter...</option>
                    {reciters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Audio URL</label>
                  <input required type="url" className="w-full p-2 border rounded" value={audioForm.audio_url} onChange={e => setAudioForm({...audioForm, audio_url: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAudioForm(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-amber-600 text-white rounded">Save</button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reciter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audio Link</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audios.map(audio => {
                  const reciter = reciters.find(r => r.id === audio.reciter);
                  return (
                    <tr key={audio.id}>
                      <td className="px-6 py-4 font-medium">Surah {audio.surah_number}</td>
                      <td className="px-6 py-4 text-gray-500">{reciter?.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-sm"><a href={audio.audio_url} target="_blank" className="text-amber-600 hover:underline overflow-hidden text-ellipsis max-w-[200px] inline-block">{audio.audio_url}</a></td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button onClick={() => { setAudioForm(audio); setShowAudioForm(true); }} className="text-gray-400 hover:text-amber-600"><Edit className="w-4 h-4 inline"/></button>
                        <button onClick={() => deleteAudio(audio.id)} className="text-gray-400 hover:text-red-600"><Trash className="w-4 h-4 inline"/></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
