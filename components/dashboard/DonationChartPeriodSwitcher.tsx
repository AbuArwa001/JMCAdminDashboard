import clsx from "clsx";

interface Props {
  period: string;
  onSelect: (p: string) => void;
}

export function DonationChartPeriodSwitcher({ period, onSelect }: Props) {
  return (
    <div className="flex items-center p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 w-fit">
      {[
        { id: "week", label: "Week" },
        { id: "month", label: "Month" },
        { id: "year", label: "Year" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
            period === item.id ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

