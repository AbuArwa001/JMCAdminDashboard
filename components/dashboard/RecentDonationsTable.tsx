import { RECENT_DONATIONS } from "@/lib/data";
import clsx from "clsx";

export default function RecentDonationsTable() {
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
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {RECENT_DONATIONS.map((donation) => (
                            <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-3 pl-2 text-sm font-medium text-gray-900">{donation.donorName}</td>
                                <td className="py-3 text-sm font-bold text-gray-900">KES {donation.amount.toLocaleString()}</td>
                                <td className="py-3 text-sm text-gray-500">{donation.category}</td>
                                <td className="py-3 text-sm text-gray-500">{donation.paymentMethod}</td>
                                <td className="py-3">
                                    <span className={clsx("text-xs font-medium px-2 py-1 rounded-full",
                                        donation.status === 'Completed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    )}>
                                        {donation.status}
                                    </span>
                                </td>
                                <td className="py-3 text-xs text-gray-400">
                                    {new Date(donation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
