import { updateTransaction } from "@/lib/api_data";
import { Transaction } from "@/lib/data";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export default function RecentDonationsTable({
  transactions,
  isLoading,
}: RecentTransactionsTableProps) {
  const [localTransactions, setLocalTransactions] =
    useState<Transaction[]>(transactions);

  // Sync localTransactions with props when they change
  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);
  const handleCompletePayment = async (id: string) => {
    try {
      // Optimistic UI update
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, payment_status: "Completed" } : t,
        ),
      );

      // API call
      await updateTransaction(id, {
        payment_status: "Completed",
      });

      alert(`Payment for donation ${id} marked as Completed`);
    } catch (error) {
      console.error(error);

      // Rollback if API fails
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, payment_status: "Pending" } : t,
        ),
      );

      alert("Failed to update payment status");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 h-full hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-secondary-dark tracking-tight">
            Recent Donations
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            Latest incoming contributions
          </p>
        </div>
        {!isLoading && (
          <button className="text-xs font-semibold text-primary hover:text-white hover:bg-primary border border-primary/20 px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-primary/20">
            View All
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-gray-50/50 rounded-lg">
              <th className="py-3 pl-4 rounded-l-lg">Donor</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Category</th>
              <th className="py-3">Method</th>
              <th className="py-3">Status</th>
              <th className="py-3">Time</th>
              <th className="py-3 pr-4 rounded-r-lg">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 pl-4">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-20 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="py-4">
                      <Skeleton className="h-4 w-16 rounded-lg" />
                    </td>
                    <td className="py-4 pr-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </td>
                  </tr>
                ))
              : localTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="group hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="py-4 pl-4">
                      <div className="font-semibold text-sm text-gray-900">
                        {transaction.user?.full_name || "Anonymous"}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-mono font-bold text-gray-900">
                        KES {transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-nowrap">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-500">
                      {transaction.payment_method}
                    </td>
                    <td className="py-4">
                      <span
                        className={clsx(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm",
                          transaction.payment_status === "Completed"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-amber-50 text-amber-700 border-amber-100",
                        )}
                      >
                        {transaction.payment_status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-gray-400 font-mono">
                      {new Date(transaction.donated_at!).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      {transaction.payment_status === "Pending" &&
                      transaction.payment_method === "Cash" ? (
                        <button
                          onClick={() => handleCompletePayment(transaction.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Empty State if no transactions */}
      {!isLoading && localTransactions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No recent donations found.</p>
        </div>
      )}
    </div>
  );
}
