import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryData } from "@/lib/data";

interface Props {
  categories: CategoryData[];
  onDelete: (id: string) => void;
}

export function CategoriesTableView({ categories, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Colour</th>
              <th className="py-3 px-4">Total Raised</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-4 font-bold text-gray-900">{cat.category_name}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: cat.color }} />
                    <span className="font-mono text-gray-500">{cat.color}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">KES {(cat.total_amount || 0).toLocaleString()}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/categories/${cat.id}/edit`} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => cat.id && onDelete(cat.id)} className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
