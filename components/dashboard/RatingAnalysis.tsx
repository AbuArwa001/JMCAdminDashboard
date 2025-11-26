import { RATINGS } from "@/lib/data";
import { Star } from "lucide-react";

export default function RatingAnalysis() {
    const averageRating = RATINGS.reduce((acc, curr) => acc + curr.rating, 0) / RATINGS.length;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-bold text-gray-900 mb-4">Donation Experience Rating</h3>

            <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                <div className="flex flex-col">
                    <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(averageRating) ? "fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500">{RATINGS.length} Reviews</span>
                </div>
            </div>

            <div className="space-y-3">
                {RATINGS.slice(0, 3).map((rating, idx) => (
                    <div key={idx} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{rating.donorName}</span>
                            <span className="text-xs text-gray-400">{rating.date}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-1">
                            {[...Array(rating.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">"{rating.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
