import { Edit, Trash } from "lucide-react";

interface Props {
  duas: any[];
  onEdit: (d: any) => void;
  onDelete: (id: number) => void;
}

export function DuasList({ duas, onEdit, onDelete }: Props) {
  if (duas.length === 0) {
    return <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">No duas found in this category.</div>;
  }

  return (
    <div className="space-y-4">
      {duas.map((dua) => (
        <div key={dua.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 relative group">
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(dua)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:text-amber-600"><Edit className="w-4 h-4" /></button>
            <button onClick={() => onDelete(dua.id)} className="p-1.5 bg-gray-100 text-gray-600 rounded hover:text-red-600"><Trash className="w-4 h-4" /></button>
          </div>
          <div className="flex justify-between items-start pr-20">
            <h3 className="font-bold text-lg">{dua.title}</h3>
            {!dua.published && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">Draft</span>}
          </div>
          <div className="text-right text-xl font-arabic leading-loose my-2 text-slate-800" dir="rtl">{dua.arabic_text}</div>
          {dua.transliteration && <div className="text-sm italic text-gray-600">{dua.transliteration}</div>}
          <div className="text-sm text-gray-800">{dua.translation_en}</div>
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{dua.source_reference}</div>
        </div>
      ))}
    </div>
  );
}
