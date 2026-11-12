import { MessageSquareQuote, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";
import { getRatings } from "@/lib/api_data";
import { ApiRating, RatingFeedbackItem } from "./RatingFeedbackItem";
import { RatingScoreHeader } from "./RatingScoreHeader";
import { RatingAnalysisSkeleton } from "./RatingAnalysisSkeleton";

interface RatingAnalysisProps {
  isLoading?: boolean;
}

export default function RatingAnalysis({ isLoading: parentLoading }: RatingAnalysisProps) {
  const [ratings, setRatings] = useState<ApiRating[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(true);
  const isLoading = parentLoading || isLoadingInternal;

  useEffect(() => {
    getRatings()
      .then((data) => setRatings(data))
      .catch((err) => console.error("Failed to fetch ratings:", err))
      .finally(() => setIsLoadingInternal(false));
  }, []);

  const avg = ratings.length > 0 ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length : 0;

  if (isLoading) return <RatingAnalysisSkeleton />;

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-2">
              Donor Feedback <MessageSquareQuote className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Community Satisfaction Score</p>
          </div>
        </div>

        <RatingScoreHeader averageRating={avg} totalRatings={ratings.length} />

        <div className="space-y-3">
          {ratings.slice(0, 3).map((rating) => (
            <RatingFeedbackItem key={rating.id} rating={rating} />
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
