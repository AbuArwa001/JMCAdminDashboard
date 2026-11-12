"use client";

import { Send, Building, ShieldCheck } from "lucide-react";
import { BankAccount } from "@/lib/data";

interface Props {
  accounts: BankAccount[];
  formData: { destination_account: string; amount: string; description: string };
  isSubmitting: boolean;
  onChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TransferInitiateForm({ accounts, formData, isSubmitting, onChange, onSubmit }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl"><Send className="w-5 h-5" /></div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Initiate B2B Transfer</h2>
          <p className="text-xs text-gray-400">Move funds from JMC Paybill to bank</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Destination Bank Account</label>
          <select
            value={formData.destination_account}
            onChange={(e) => onChange({ ...formData, destination_account: e.target.value })}
            className="form-input text-xs"
            required
          >
            <option value="">Select a registered account...</option>
            {accounts.filter((a) => a.is_active).map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.bank_name} - {acc.account_name} ({acc.account_number})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Amount (KES)</label>
          <input
            type="number"
            min="1"
            value={formData.amount}
            onChange={(e) => onChange({ ...formData, amount: e.target.value })}
            placeholder="e.g. 50000"
            className="form-input text-xs font-mono"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Transfer Purpose</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => onChange({ ...formData, description: e.target.value })}
            className="form-input text-xs"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 text-xs mt-2">
          {isSubmitting ? "Initiating..." : "Execute Settlement"}
        </button>
      </form>
    </div>
  );
}

