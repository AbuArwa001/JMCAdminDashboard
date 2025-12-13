import api from "@/lib/api";
import { RECENT_DONATIONS, Transaction } from "@/lib/data";
import clsx from "clsx";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface RecentTransactionsTableProps {
    transactions: Transaction[]; 
}

export default function RecentDonationsTable({ transactions }: RecentTransactionsTableProps) {
    const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions);

    // Sync localTransactions with props when they change
    useEffect(() => {
        setLocalTransactions(transactions);
    }, [transactions]);

    console.log("RecentDonationsTable transactions:", localTransactions);
    
    const handleCompletePayment = async (id: string) => {
        try {
            // Optimistic UI update
            setLocalTransactions(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, payment_status: "Completed" }
                        : t
                )
            );

            // API call
            await api.put(`api/v1/transactions/${id}/`, {
                payment_status: "Completed",
            });

            alert(`Payment for donation ${id} marked as Completed`);
        } catch (error) {
            console.error(error);

            // Rollback if API fails
            setLocalTransactions(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, payment_status: "Pending" }
                        : t
                )
            );

            alert("Failed to update payment status");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Recent Donations</h3>
                <button className="text-sm text-primary hover:text-primary-bronze font-medium">View All</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 pl-2">Donor</th>
                            <th className="pb-3">Amount</th>
                            <th className="pb-3">Category</th>
                            <th className="pb-3">Method</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3">Time</th>
                            <th className="pb-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {localTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-3 pl-2 text-sm font-medium text-gray-900">{transaction.user?.full_name}</td>
                                <td className="py-3 text-sm font-bold text-gray-900">KES {transaction.amount.toLocaleString()}</td>
                                <td className="py-3 text-sm text-gray-500">{transaction.category}</td>
                                <td className="py-3 text-sm text-gray-500">{transaction.payment_method}</td>
                                <td className="py-3">
                                    <span className={clsx("text-xs font-medium px-2 py-1 rounded-full",
                                        transaction.payment_status === 'Completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {transaction.payment_status}
                                    </span>
                                </td>
                                <td className="py-3 text-xs text-gray-400">
                                    {new Date(transaction.donated_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="py-3">
                                    {transaction.payment_status === 'Pending' && transaction.payment_method === 'Cash' && (
                                        <button
                                            onClick={() => handleCompletePayment(transaction.id)}
                                            className="text-primary hover:text-primary-green transition-colors"
                                            title="Mark as Completed"
                                        >
                                            <CheckCircle className="w-5 h-5"/>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}