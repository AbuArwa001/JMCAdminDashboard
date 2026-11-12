import Image from "next/image";
import { format } from "date-fns";
import { Newspaper, Bell, Trash } from "lucide-react";

interface Props {
  bulletins: any[];
  notifyingId: number | null;
  onNotify: (id: number) => void;
  onDelete: (id: number) => void;
}

export function BulletinsTable({ bulletins, notifyingId, onNotify, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <th className="px-6 py-4 border-b border-gray-100">Cover</th>
              <th className="px-6 py-4 border-b border-gray-100">Title</th>
              <th className="px-6 py-4 border-b border-gray-100">Issue</th>
              <th className="px-6 py-4 border-b border-gray-100">Published</th>
              <th className="px-6 py-4 border-b border-gray-100 text-center">Status</th>
              <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bulletins.map((b) => (
              <tr key={b.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  {b.cover_image_path ? (
                    <div className="w-12 h-16 relative rounded overflow-hidden shadow-sm border border-gray-200">
                      <Image src={b.cover_image_path.startsWith("http") ? b.cover_image_path : process.env.NEXT_PUBLIC_API_URL + b.cover_image_path} alt="Cover" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400"><Newspaper className="w-5 h-5" /></div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{b.title}</p>
                  <a href={b.pdf_path.startsWith("http") ? b.pdf_path : process.env.NEXT_PUBLIC_API_URL + b.pdf_path} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-0.5 inline-block">View PDF</a>
                </td>
                <td className="px-6 py-4"><span className="text-sm font-medium text-gray-700">{b.issue_number || "-"}</span></td>
                <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-800">{format(new Date(b.published_date), "MMM d, yyyy")}</p></td>
                <td className="px-6 py-4 text-center">
                  <span className={b.is_active ? "badge-emerald" : "px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full"}>{b.is_active ? "Active" : "Hidden"}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onNotify(b.id)} disabled={notifyingId === b.id} title="Broadcast Notification" className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg disabled:opacity-50">
                      <Bell className={`w-4 h-4 ${notifyingId === b.id ? "animate-spin" : ""}`} />
                    </button>
                    <button onClick={() => onDelete(b.id)} title="Delete Bulletin" className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {bulletins.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-500 font-medium">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3"><Newspaper className="w-6 h-6 text-blue-300" /></div>
                  No bulletins uploaded yet. Upload the first Friday Bulletin above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

