import clsx from "clsx";
import { Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { Transfer } from "@/lib/data";
import { exportTransfersToExcel } from "@/lib/excel-export";

interface Props {
  history: Transfer[];
  isLoading: boolean;
}

export function TransferHistoryTable({ history, isLoading }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">Transfer Audit Ledger</h2>
          <p className="text-xs text-gray-400">Complete log of automated & manual transfers</p>
        </div>
        <button onClick={() => exportTransfersToExcel(history)} className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3">
          <Download className="w-3.5 h-3.5" /> Export Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px]">
              <th className="py-3 px-2">Account</th>
              <th className="py-3 px-2">Amount</th>
              <th className="py-3 px-2">Reference</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-2 font-bold text-gray-800">{t.destination_account_details?.account_name || "Account"}</td>
                <td className="py-3 px-2 font-mono font-bold text-gray-900">KES {t.amount.toLocaleString()}</td>
                <td className="py-3 px-2 font-mono text-gray-500">{t.transaction_reference || "N/A"}</td>
                <td className="py-3 px-2 text-gray-400">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-2 text-right">
                  <span className={clsx("px-2 py-0.5 rounded-full text-[10px] font-bold border", t.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200")}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
