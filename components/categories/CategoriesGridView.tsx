import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { CategoryData } from "@/lib/data";

interface Props {
  categories: CategoryData[];
  onDelete: (id: string) => void;
}

export function CategoriesGridView({ categories, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((cat) => (
        <div key={cat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="w-6 h-6 rounded-xl border" style={{ backgroundColor: cat.color }} />
              <div className="flex items-center gap-1">
                <Link href={`/categories/${cat.id}/edit`} className="p-1 text-gray-400 hover:text-gray-700 rounded-lg">
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <button onClick={() => cat.id && onDelete(cat.id)} className="p-1 text-gray-400 hover:text-rose-600 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h4 className="font-bold text-gray-900 text-sm">{cat.category_name}</h4>
          </div>
          <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center text-xs">
            <span className="text-gray-400">Total Funds:</span>
            <span className="font-bold font-mono text-gray-900">KES {(cat.total_amount || 0).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
