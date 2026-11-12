import { Skeleton } from "@/components/ui/Skeleton";

export function DriveCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05)] flex flex-col h-full space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-36 rounded-xl" />
          <Skeleton className="h-4 w-24 mt-2 rounded-full" />
        </div>
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
      <div className="mt-auto flex gap-3 pt-4">
        <Skeleton className="h-10 flex-1 rounded-2xl" />
        <Skeleton className="h-10 w-24 rounded-2xl" />
      </div>
    </div>
  );
}

