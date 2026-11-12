"use client";

import { Skeleton } from "./Skeleton";

export function GridCardSkeleton() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-white/60 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-6 flex-1 flex flex-col space-y-4">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
