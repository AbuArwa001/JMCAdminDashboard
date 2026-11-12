import { Star } from "lucide-react";

interface Props {
  averageRating: number;
  totalRatings: number;
}

export function RatingScoreHeader({ averageRating, totalRatings }: Props) {
  return (
    <div className="flex items-center gap-5 mb-6 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="text-4xl font-extrabold bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
        {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex text-amber-400 gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-4 h-4 ${star <= Math.round(averageRating || 5) ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-slate-700"}`} />
          ))}
        </div>
        <span className="text-[11px] font-bold text-slate-400">
          {totalRatings > 0 ? `${totalRatings} Verified Reviews` : "Based on active donor ratings"}
        </span>
      </div>
    </div>
  );
}
