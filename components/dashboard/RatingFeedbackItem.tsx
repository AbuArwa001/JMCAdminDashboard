import { Star } from "lucide-react";

export interface ApiRating {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function RatingFeedbackItem({ rating }: { rating: ApiRating }) {
  return (
    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:border-amber-500/30 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
          {rating.user_name || "Anonymous Supporter"}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          {new Date(rating.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>
      <div className="flex text-amber-400 gap-0.5 mb-1.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < Math.round(rating.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
        ))}
      </div>
      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
        "{rating.comment || "May Allah bless the Mosque administration for their transparent work."}"
      </p>
    </div>
  );
}
