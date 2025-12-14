import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getRatings } from "@/lib/api_data";
import { RatingData } from "@/lib/data";

interface ApiRating {
    id: number;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export default function RatingAnalysis() {
    const [ratings, setRatings] = useState<ApiRating[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const data = await getRatings();
                setRatings(data);
            } catch (error) {
                console.error("Failed to fetch ratings:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRatings();
    }, []);

    const averageRating = ratings.length > 0
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
        : 0;

    if (isLoading) {
        return <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center">Loading ratings...</div>;
    }

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
                    <span className="text-sm text-gray-500">{ratings.length} Reviews</span>
                </div>
            </div>

            <div className="space-y-3">
                {ratings.slice(0, 3).map((rating) => (
                    <div key={rating.id} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{rating.user_name || "Anonymous"}</span>
                            <span className="text-xs text-gray-400">{new Date(rating.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-1">
                            {[...Array(rating.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">"{rating.comment}"</p>
                    </div>
                ))}
                {ratings.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No ratings yet</p>
                )}
            </div>
        </div>
    );
}
