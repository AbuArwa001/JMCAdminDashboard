import { HelpCircle, Database, Clock, FileText } from "lucide-react";

export function DeleteAccountFaq() {
  return (
    <div className="space-y-6 pt-4 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-[#c99335]" />
        Frequently Asked Questions & Compliance Disclosures
      </h3>

      <div className="grid sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Database className="w-4 h-4 text-[#006838]" />
            <h4>What is deleted?</h4>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Your login identity, Firebase auth records, personal profile info (name, email, phone), device push notification tokens, and saved preferences are permanently erased.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <FileText className="w-4 h-4 text-[#c99335]" />
            <h4>What is retained?</h4>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Past financial donation receipts and transaction records are retained in compliance with Kenyan statutory tax and non-profit auditing laws, but are decoupled from your active profile.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Clock className="w-4 h-4 text-red-600" />
            <h4>How long does it take?</h4>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Upon submission and verification of account ownership, your deletion request is processed within 14 to 30 business days.
          </p>
        </div>
      </div>
    </div>
  );
}

