import Image from "next/image";
import { format } from "date-fns";
import { Image as ImageIcon, Bell, Edit, Trash } from "lucide-react";

interface Props {
  event: any;
  onGallery: (e: any) => void;
  onNotify: (id: number) => void;
  onEdit: (e: any) => void;
  onDelete: (id: number) => void;
}

export function EventCard({ event, onGallery, onNotify, onEdit, onDelete }: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col relative">
      <div className="h-48 bg-gray-100 relative">
        {event.cover_image ? (
          <Image src={event.cover_image} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-amber-300" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-sm ${event.published ? "bg-green-500/90 text-white" : "bg-white/90 text-gray-800"}`}>
            {event.published ? "Live" : "Draft"}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">{event.category_name || "General Event"}</div>
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-amber-600 transition-colors">{event.title}</h3>
        <div className="space-y-2 mt-auto text-sm text-gray-600 font-medium">
          <div className="flex items-center"><span className="w-5 mr-2 opacity-50">📅</span>{format(new Date(event.event_date), "MMMM d, yyyy")} @ {event.start_time}</div>
          <div className="flex items-center"><span className="w-5 mr-2 opacity-50">📍</span>{event.venue_name}</div>
          {event.guest_name && <div className="flex items-center"><span className="w-5 mr-2 opacity-50">🎙️</span>{event.guest_name}</div>}
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center gap-2">
        <button onClick={() => onGallery(event)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
          <ImageIcon className="w-4 h-4" /> Gallery
        </button>
        <div className="flex items-center gap-1">
          <button onClick={() => onNotify(event.id)} className="p-2 rounded-lg text-amber-600 hover:bg-amber-50" title="Send Notification"><Bell className="w-4 h-4" /></button>
          <button onClick={() => onEdit(event)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-200" title="Edit"><Edit className="w-4 h-4" /></button>
          <button onClick={() => onDelete(event.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete"><Trash className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}
