interface Props {
  data: { name: string; value: number; color: string }[];
  grandTotal: number;
}

export function CategoryLegendList({ data, grandTotal }: Props) {
  return (
    <div className="max-h-[135px] overflow-y-auto pr-1 space-y-1 mt-1">
      {data.map((entry, index) => {
        const percentage = grandTotal > 0 ? Math.round((entry.value / grandTotal) * 100) : 0;
        return (
          <div key={`legend-${index}`} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors group text-xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: entry.color }} />
              <span className="font-medium text-slate-700 truncate group-hover:text-amber-600 transition-colors" title={entry.name}>
                {entry.name}
              </span>
            </div>
            <span className="font-bold text-slate-900 font-mono text-[11px] shrink-0">{percentage}%</span>
          </div>
        );
      })}
    </div>
  );
}

