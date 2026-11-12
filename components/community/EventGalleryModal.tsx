import { useState } from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import api from "@/lib/api";

interface Props {
  event: any;
  onClose: () => void;
  onRefresh: () => void;
}

export function EventGalleryModal({ event, onClose, onRefresh }: Props) {
  const [currentEvent, setCurrentEvent] = useState(event);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !currentEvent) return;
    try {
      const data = new FormData();
      data.append("event", currentEvent.id);
      data.append("image", file);
      if (caption) data.append("caption", caption);
      await api.post("/api/v1/events/images/", data, { headers: { "Content-Type": "multipart/form-data" } });
      setFile(null);
      setCaption("");
      const updated = (await api.get(`/api/v1/events/${currentEvent.id}/`)).data;
      setCurrentEvent(updated);
      onRefresh();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/v1/events/images/${id}/`);
      const updated = (await api.get(`/api/v1/events/${currentEvent.id}/`)).data;
      setCurrentEvent(updated);
      onRefresh();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Gallery: {currentEvent.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 font-bold">Close</button>
        </div>
        <form onSubmit={handleUpload} className="bg-slate-50 p-4 rounded border border-slate-200 flex items-end gap-4">
          <div className="flex-1"><label className="block text-sm font-medium mb-1">Image</label><input required type="file" accept="image/*" className="w-full p-2 border rounded bg-white" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
          <div className="flex-1"><label className="block text-sm font-medium mb-1">Caption (Optional)</label><input type="text" className="w-full p-2 border rounded bg-white" value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
          <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded font-medium hover:bg-amber-700">Upload</button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentEvent.gallery_images?.map((img: any) => (
            <div key={img.id} className="relative group rounded overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex flex-col justify-between">
              <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(img.id)} className="p-1 bg-white/80 rounded text-red-600 hover:bg-white"><Trash className="w-4 h-4" /></button>
              </div>
              <div className="relative flex-1"><Image src={img.image} alt={img.caption || ""} fill className="object-cover" /></div>
              {img.caption && <div className="p-1 text-xs text-center truncate bg-white">{img.caption}</div>}
            </div>
          ))}
          {(!currentEvent.gallery_images || currentEvent.gallery_images.length === 0) && (
            <div className="col-span-full py-8 text-center text-gray-500 text-sm">No images in gallery yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
