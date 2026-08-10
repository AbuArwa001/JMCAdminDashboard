import { updateTransaction } from "@/lib/api_data";
import { Transaction } from "@/lib/data";
import clsx from "clsx";
import { CheckCircle, ArrowUpRight, CreditCard, Wallet, Smartphone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import Link from "next/link";

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

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const handleCompletePayment = async (id: string) => {
    try {
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, payment_status: "Completed" } : t,
        ),
      );

      await updateTransaction(id, {
        payment_status: "Completed",
      });

      toast.success(`Payment for donation ${id} marked as Completed`);
    } catch (error) {
      console.error(error);
      setLocalTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, payment_status: "Pending" } : t,
        ),
      );
      toast.error("Failed to update payment status");
    }
  };

  const getMethodIcon = (method: string) => {
    if (method?.toLowerCase().includes("mpesa") || method?.toLowerCase().includes("mobile")) {
      return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (method?.toLowerCase().includes("card")) {
      return <CreditCard className="w-3.5 h-3.5 text-indigo-500" />;
    }
    return <Wallet className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_45px_-12px_rgba(190,152,48,0.12)] transition-all duration-300 h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-2">
            Recent Contributions
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Live stream of incoming community donations
          </p>
        </div>
        {!isLoading && (
          <Link
            href="/donations"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            Full Ledger <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/80">
              <th className="py-3 pl-4 rounded-l-xl">Donor</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Category</th>
              <th className="py-3">Method</th>
              <th className="py-3">Status</th>
              <th className="py-3">Time</th>
              <th className="py-3 pr-4 rounded-r-xl text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-xl" />
                        <Skeleton className="h-4 w-28 rounded-lg" />
                      </div>
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
                      <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                    </td>
                  </tr>
                ))
              : localTransactions.map((transaction) => {
                  const name = transaction.user?.full_name || "Anonymous Donor";
                  const initial = name.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={transaction.id}
                      className="group hover:bg-amber-500/5 transition-colors"
                    >
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-extrabold text-slate-950 text-xs shadow-sm shadow-amber-500/20">
                            {initial}
                          </div>
                          <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                            {name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-extrabold text-sm text-slate-900">
                          KES {transaction.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg text-nowrap">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                          {getMethodIcon(transaction.payment_method)}
                          <span>{transaction.payment_method}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={clsx(
                            "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm inline-flex items-center gap-1",
                            transaction.payment_status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/30",
                          )}
                        >
                          <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", transaction.payment_status === "Completed" ? "bg-emerald-500" : "bg-amber-500")}></span>
                          {transaction.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-slate-400 font-mono font-medium">
                        {transaction.donated_at
                          ? new Date(transaction.donated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Just now"}
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        {transaction.payment_status === "Pending" &&
                        transaction.payment_method === "Cash" ? (
                          <button
                            onClick={() => handleCompletePayment(transaction.id)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 rounded-xl transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          </button>
                        ) : (
                          <div className="w-8 h-8 ml-auto flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ShieldCheck className="w-4 h-4 text-slate-300" />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {!isLoading && localTransactions.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="font-semibold text-sm">No recent donations found in system.</p>
        </div>
      )}
    </div>
  );
}

