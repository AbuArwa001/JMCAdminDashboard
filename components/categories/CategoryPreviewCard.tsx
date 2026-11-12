interface Props {
  name: string;
  color: string;
}

export function CategoryPreviewCard({ name, color }: Props) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <p className="form-label mb-2">Preview</p>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: color }} />
        <div>
          <p className="text-sm font-bold text-gray-900">{name || "Category Name"}</p>
          <p className="text-xs text-gray-400 mt-0.5">Donation fund category</p>
        </div>
        <span className="ml-auto px-3 py-1 text-xs font-bold rounded-full text-white" style={{ backgroundColor: color }}>
          Sample
        </span>
      </div>
    </div>
  );
}
