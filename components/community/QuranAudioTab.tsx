import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import api from "@/lib/api";

interface Props {
  audios: any[];
  reciters: any[];
  onRefresh: () => void;
  onDelete: (id: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

export function QuranAudioTab({ audios, reciters, onRefresh, onDelete, isSubmitting, setIsSubmitting }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: undefined as number | undefined, surah_number: 1, reciter_id: reciters[0]?.id || 0, audio_url: "" });

  const saveAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { surah_number: Number(form.surah_number), reciter_id: Number(form.reciter_id), audio_url: form.audio_url };
      if (form.id) await api.put(`/api/v1/quran/audio/${form.id}`, payload);
      else await api.post("/api/v1/quran/audio", payload);
      setShowForm(false);
      onRefresh();
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Surah Audio Files ({audios.length})</h2>
        <button onClick={() => { setForm({ id: undefined, surah_number: 1, reciter_id: reciters[0]?.id || 0, audio_url: "" }); setShowForm(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-amber-700">
          <Plus className="w-4 h-4" /> Assign Audio
        </button>
      </div>
      {showForm && (
        <form onSubmit={saveAudio} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Surah Number (1-114)</label><input required type="number" min="1" max="114" className="w-full p-2 border rounded" value={form.surah_number} onChange={(e) => setForm({ ...form, surah_number: Number(e.target.value) })} /></div>
            <div><label className="block text-sm font-medium mb-1">Reciter</label><select required className="w-full p-2 border rounded" value={form.reciter_id} onChange={(e) => setForm({ ...form, reciter_id: Number(e.target.value) })}><option value={0}>Select Reciter...</option>{reciters.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}</select></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">Audio URL</label><input required type="url" className="w-full p-2 border rounded" value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 font-medium" disabled={isSubmitting}>Cancel</button><button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white rounded px-6 py-2">Save</button></div>
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
            {audios.map((audio) => (
              <tr key={audio.id}>
                <td className="px-6 py-4 font-medium">Surah {audio.surah_number}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{reciters.find((r) => r.id === (audio.reciter_id ?? audio.reciter))?.name || "Unknown"}</td>
                <td className="px-6 py-4 text-sm"><a href={audio.audio_url} target="_blank" className="text-amber-600 hover:underline overflow-hidden text-ellipsis max-w-[240px] inline-block">{audio.audio_url}</a></td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => { setForm({ id: audio.id, surah_number: audio.surah_number, reciter_id: audio.reciter_id ?? audio.reciter, audio_url: audio.audio_url }); setShowForm(true); }} className="text-gray-400 hover:text-amber-600"><Edit className="w-4 h-4 inline" /></button>
                  <button onClick={() => onDelete(audio.id)} className="text-gray-400 hover:text-red-600"><Trash className="w-4 h-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
