import { format } from "date-fns";
import { BookOpen, Edit, Trash } from "lucide-react";

interface Props {
  darsas: any[];
  onTogglePublish: (d: any) => void;
  onEdit: (d: any) => void;
  onDelete: (id: number) => void;
}

export function DarsasTable({ darsas, onTogglePublish, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-teal-500" />All Darsas</h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{darsas.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <th className="px-6 py-4 border-b border-gray-100">Title</th>
              <th className="px-6 py-4 border-b border-gray-100">Sheikh</th>
              <th className="px-6 py-4 border-b border-gray-100">Scheduled</th>
              <th className="px-6 py-4 border-b border-gray-100">Status</th>
              <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {darsas.map((darsa) => (
              <tr key={darsa.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4"><p className="text-sm font-bold text-gray-900 group-hover:text-[#006838] transition-colors">{darsa.title}</p></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-600 font-medium">{darsa.author_or_sheikh}</span></td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {darsa.scheduled_for ? format(new Date(darsa.scheduled_for), "MMM d, yyyy HH:mm") : "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={darsa.is_published ? "badge-emerald" : "px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full"}>{darsa.is_published ? "Published" : "Draft"}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onTogglePublish(darsa)} className="px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-colors text-indigo-600 hover:bg-indigo-50 border-indigo-200">
                      {darsa.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => onEdit(darsa)} className="p-1.5 text-gray-400 hover:text-[#006838] hover:bg-emerald-50 rounded-lg"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(darsa.id!)} className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {darsas.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500 font-medium">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><BookOpen className="w-6 h-6 text-gray-300" /></div>
                  No darsas found. Add your first darsa using the button above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

