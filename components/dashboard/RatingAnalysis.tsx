import { Star } from "lucide-react";
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-12" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 h-full overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <h3 className="font-bold text-secondary-dark tracking-tight mb-1">
        Feedback
      </h3>
      <p className="text-xs text-gray-400 font-medium mb-6">
        User Satisfaction Score
      </p>

      <div className="flex items-center gap-6 mb-8 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
        <div className="text-5xl font-bold bg-gradient-to-br from-primary to-primary-bronze bg-clip-text text-transparent">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex text-amber-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(averageRating) ? "fill-current drop-shadow-sm" : "text-gray-200"}`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-400">
            {ratings.length} verified reviews
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {ratings.slice(0, 3).map((rating) => (
          <div
            key={rating.id}
            className="relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors py-1 group"
          >
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  {rating.user_name || "Anonymous Donor"}
                </span>
                <div className="flex text-amber-400 gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2.5 h-2.5 ${i < Math.round(rating.rating) ? "fill-current" : "text-gray-200"}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono tracking-tighter">
                {new Date(rating.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic group-hover:text-gray-700 transition-colors">
              "{rating.comment || "No comment provided"}"
            </p>
          </div>
        ))}
        {ratings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Star className="w-8 h-8 opacity-20 mb-2" />
            <p className="text-xs">No ratings collected yet</p>
          </div>
        )}
      </div>

      {ratings.length > 3 && (
        <div className="mt-6 pt-4 border-t border-gray-50 text-center">
          <button className="text-xs font-semibold text-primary hover:text-secondary-dark transition-colors">
            View All Reviews
          </button>
        </div>
      )}
    </div>
  );
}
