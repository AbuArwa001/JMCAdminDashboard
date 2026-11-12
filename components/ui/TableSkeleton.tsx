"use client";

import { Skeleton } from "./Skeleton";

export function TableSkeleton() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-6 py-4 border-b border-gray-100">
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <tr key={row}>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-40 rounded-md" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32 rounded-md" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-24 rounded-md" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
