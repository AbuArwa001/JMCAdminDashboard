import { BankAccount } from "@/lib/data";
import { Smartphone, Building2, CreditCard, ChevronDown } from "lucide-react";
import { DriveDarajaCredentials } from "./DriveDarajaCredentials";

interface Props {
  formData: any;
  accounts: BankAccount[];
  paymentMethod: "MPESA" | "BANK";
  selectedAccountId: string;
  showCustomCreds?: boolean;
  onSetPaymentMethod: (m: "MPESA" | "BANK") => void;
  onAccountSelect: (id: string) => void;
  onToggleCustomCreds?: (show: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DrivePaymentSection({
  formData, accounts, paymentMethod, selectedAccountId, showCustomCreds = false,
  onSetPaymentMethod, onAccountSelect, onToggleCustomCreds, onChange
}: Props) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Payment Configuration</h3>
          <p className="text-[11px] text-gray-400">M-Pesa paybill or bank account details</p>
        </div>
      </div>
      <div className="form-section-body space-y-6">
        <div className="flex gap-3">
          {(["MPESA", "BANK"] as const).map((method) => (
            <button key={method} type="button" onClick={() => onSetPaymentMethod(method)} className={`flex items-center gap-2.5 flex-1 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${paymentMethod === method ? "border-[#006838] bg-emerald-50 text-[#006838]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
              {method === "MPESA" ? <Smartphone className={`w-4 h-4 ${paymentMethod === "MPESA" ? "text-[#006838]" : "text-gray-400"}`} /> : <Building2 className={`w-4 h-4 ${paymentMethod === "BANK" ? "text-[#006838]" : "text-gray-400"}`} />}
              {method === "MPESA" ? "M-Pesa Paybill" : "Bank Account"}
            </button>
          ))}
        </div>
        <div>
          <label className="form-label">Select Existing Account (Optional)</label>
          <div className="relative">
            <select value={selectedAccountId} onChange={(e) => onAccountSelect(e.target.value)} className="form-input appearance-none pr-10 cursor-pointer">
              <option value="manual">— Enter Details Manually —</option>
              {accounts.map((acc) => (<option key={acc.id} value={acc.id}>{acc.bank_name} - {acc.account_name} ({acc.paybill_number ? `Paybill: ${acc.paybill_number}` : `Acc: ${acc.account_number}`})</option>))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
          {paymentMethod === "MPESA" ? (
            <>
              <div><label className="form-label">Paybill Number</label><input type="text" name="paybill_number" value={formData.paybill_number || ""} onChange={onChange} className="form-input" placeholder="e.g. 247247" /></div>
              <div><label className="form-label">Account Name</label><input type="text" name="account_name" value={formData.account_name || ""} onChange={onChange} className="form-input" placeholder="e.g. JMC Donation" /></div>
              {onToggleCustomCreds && <DriveDarajaCredentials formData={formData} showCustomCreds={showCustomCreds} onToggleCustomCreds={onToggleCustomCreds} onChange={onChange} />}
            </>
          ) : (
            <>
              <div><label className="form-label">Bank Paybill / Code</label><input type="text" name="paybill_number" value={formData.paybill_number || ""} onChange={onChange} className="form-input" placeholder="Bank Code" /></div>
              <div><label className="form-label">Account Number</label><input type="text" name="account_number" value={formData.account_number || ""} onChange={onChange} className="form-input" placeholder="Account Number" /></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

