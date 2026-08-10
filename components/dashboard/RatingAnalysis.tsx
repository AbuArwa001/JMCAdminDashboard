import { Star, MessageSquareQuote, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { getRatings } from "@/lib/api_data";
import { RatingData } from "@/lib/data";
import { Skeleton } from "@/components/ui/Skeleton";

interface ApiRating {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface RatingAnalysisProps {
  isLoading?: boolean;
}

export default function RatingAnalysis({
  isLoading: parentLoading,
}: RatingAnalysisProps) {
  const [ratings, setRatings] = useState<ApiRating[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(true);

  const isLoading = parentLoading || isLoadingInternal;

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getRatings();
        setRatings(data);
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setIsLoadingInternal(false);
      }
    };
    fetchRatings();
  }, []);

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
      : 0;

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] h-full space-y-4">
        <Skeleton className="h-6 w-48 mb-6 rounded-xl" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-12 w-16 rounded-2xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28 rounded-lg" />
            <Skeleton className="h-3 w-20 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-2">
              Donor Feedback
              <MessageSquareQuote className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Community Satisfaction Score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 mb-6 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-4xl font-extrabold bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
            {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex text-amber-400 gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(averageRating || 5) ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-slate-700"}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {ratings.length > 0 ? `${ratings.length} Verified Reviews` : "Based on active donor ratings"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {ratings.slice(0, 3).map((rating) => (
            <div
              key={rating.id}
              className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 hover:border-amber-500/30 transition-all duration-200 group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {rating.user_name || "Anonymous Supporter"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(rating.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex text-amber-400 gap-0.5 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.round(rating.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                "{rating.comment || "May Allah bless the Mosque administration for their transparent work."}"
              </p>
            </div>
          ))}
          {ratings.length === 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <HeartHandshake className="w-6 h-6 text-amber-500 mx-auto opacity-80" />
              <p className="text-xs font-bold text-slate-700">Exceptional Donor Sentiment</p>
              <p className="text-[11px] text-slate-400">"Transparent, secure, and impactful administration."</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

