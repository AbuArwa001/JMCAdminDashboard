import clsx from "clsx";

interface Props {
  collected: number;
  target: number;
  status: string;
}

export function DriveProgressBar({ collected, target, status }: Props) {
  const progress = Math.min(100, Math.round((collected / target) * 100));
  let progressFill = "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300";
  if (status === "Closed") progressFill = "bg-slate-400";
  else if (progress >= 100) progressFill = "bg-gradient-to-r from-emerald-500 to-teal-400";

  return (
    <div className="my-4 relative z-10 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Raised</p>
          <p className="text-2xl font-extrabold text-slate-900 leading-none mt-1">KES {collected.toLocaleString()}</p>
        </div>
        <span className="text-xs font-extrabold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">{progress}%</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/50 bg-slate-100">
        <div className={clsx("h-full rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden", progressFill)} style={{ width: `${progress}%` }}>
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span>Target Goal</span>
        <span className="font-bold text-slate-700">KES {target.toLocaleString()}</span>
      </div>
    </div>
  );
}
