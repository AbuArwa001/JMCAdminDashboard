import Image from "next/image";
import { format } from "date-fns";
import { Mic, Bell, Edit, Trash } from "lucide-react";

interface Props {
  khutbas: any[];
  onNotify: (id: number) => void;
  onEdit: (khutba: any) => void;
  onDelete: (id: number) => void;
}

export function KhutbaTable({ khutbas, onNotify, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                    {k.imam_photo && <Image src={k.imam_photo} alt={k.imam_name} width={28} height={28} className="rounded-lg object-cover border border-gray-200" />}
                    <span className="text-sm font-medium text-gray-700">{k.imam_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-800">{format(new Date(k.khutba_date), "MMM d, yyyy")}</p>
                  <p className="text-xs text-gray-500 font-mono">{k.khutba_time}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={k.published ? "badge-emerald" : "px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full"}>
                    {k.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onNotify(k.id)} className="p-1.5 text-[#c99335] hover:bg-amber-50 rounded-lg" title="Send Push Notification"><Bell className="w-4 h-4" /></button>
                    <button onClick={() => onEdit(k)} className="p-1.5 text-gray-400 hover:text-[#006838] hover:bg-emerald-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(k.id)} className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {khutbas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-medium">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><Mic className="w-6 h-6 text-gray-300" /></div>
                  No khutbas found. Add your first khutba entry above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

