import { Skeleton } from "@/components/ui/Skeleton";

export function RatingAnalysisSkeleton() {
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

