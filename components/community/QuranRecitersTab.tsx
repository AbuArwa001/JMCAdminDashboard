import { useState } from "react";
import Image from "next/image";
import { Plus, Edit, Trash, Users } from "lucide-react";
import api from "@/lib/api";

interface Props {
  reciters: any[];
  onRefresh: () => void;
  onDelete: (id: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (b: boolean) => void;
}

export function QuranRecitersTab({ reciters, onRefresh, onDelete, isSubmitting, setIsSubmitting }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ id?: number; name: string; bio: string; photo?: File | null }>({ name: "", bio: "" });

  const saveReciter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("bio", form.bio);
      if (form.photo instanceof File) data.append("photo", form.photo);
      if (form.id) await api.patch(`/api/v1/quran/reciters/${form.id}/`, data, { headers: { "Content-Type": "multipart/form-data" } });
      else await api.post("/api/v1/quran/reciters/", data, { headers: { "Content-Type": "multipart/form-data" } });
      setShowForm(false);
      onRefresh();
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Reciters</h2>
        <button onClick={() => { setForm({ name: "", bio: "" }); setShowForm(true); }} className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium flex items-center gap-2 hover:bg-amber-700">
          <Plus className="w-4 h-4" /> Add Reciter
        </button>
      </div>
      {showForm && (
        <form onSubmit={saveReciter} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-semibold mb-2">{form.id ? "Edit Reciter" : "New Reciter"}</h3>
          <div><label className="block text-sm font-medium mb-1">Name</label><input required type="text" className="w-full p-2 border rounded" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1">Biography</label><textarea rows={3} className="w-full p-2 border rounded" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
          <div><label className="block text-sm font-medium mb-1">Photo</label><input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })} /></div>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500" disabled={isSubmitting}>Cancel</button><button type="submit" disabled={isSubmitting} className="bg-amber-600 text-white rounded px-6 py-2">Save</button></div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reciters.map((r) => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded backdrop-blur">
              <button onClick={() => { setForm({ id: r.id, name: r.name, bio: r.bio }); setShowForm(true); }} className="p-1 hover:text-amber-600"><Edit className="w-4 h-4" /></button>
              <button onClick={() => onDelete(r.id)} className="p-1 hover:text-red-600"><Trash className="w-4 h-4" /></button>
            </div>
            <div className="aspect-square bg-gray-100 relative">
              {r.photo ? <Image src={r.photo} alt={r.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Users className="w-16 h-16" /></div>}
            </div>
            <div className="p-4"><h3 className="font-bold text-lg">{r.name}</h3><p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.bio}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

