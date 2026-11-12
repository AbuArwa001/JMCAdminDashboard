import Link from "next/link";
import { Edit, Trash2, ArrowRightLeft, CreditCard, Building, CheckCircle2, XCircle } from "lucide-react";
import { BankAccount } from "@/lib/data";

interface Props {
  account: BankAccount;
  onDelete: (id: string) => void;
}

export function BankAccountCard({ account, onDelete }: Props) {
  const isPaybill = !!account.paybill_number;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full overflow-hidden">
      <div className={`h-1.5 w-full ${isPaybill ? "bg-gradient-to-r from-[#c99335] to-amber-400" : "bg-gradient-to-r from-[#006838] to-emerald-400"}`} />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-xl border ${isPaybill ? "bg-amber-50 text-[#c99335] border-amber-200/60" : "bg-emerald-50 text-[#006838] border-emerald-200/60"}`}>
            {isPaybill ? <CreditCard className="w-5 h-5" /> : <Building className="w-5 h-5" />}
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${account.is_active !== false ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
            {account.is_active !== false ? "Active" : "Inactive"}
          </span>
        </div>

        <div>
          <h3 className="font-bold text-base text-gray-900 group-hover:text-[#006838] transition-colors">{account.account_name}</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{account.bank_name}</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>{isPaybill ? "Paybill No:" : "Account No:"}</span>
            <span className="font-mono font-bold text-gray-900">{isPaybill ? account.paybill_number : account.account_number}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
        <Link href={`/transfers?to=${account.id}`} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 flex-1 justify-center">
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#006838]" /> Transfer
        </Link>
        <Link href={`/accounts/${account.id}/edit`} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg" title="Edit">
          <Edit className="w-4 h-4" />
        </Link>
        <button onClick={() => onDelete(account.id)} className="p-2 text-gray-400 hover:text-rose-600 rounded-lg" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
