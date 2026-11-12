import { Building2, Plus, Search } from "lucide-react";
import Link from "next/link";

interface Props {
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export function AccountsHeader({ searchTerm, onSearchChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
          <Building2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Donors &amp; Accounts
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Manage beneficiary bank accounts, MPESA paybills, and payment channels.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative group w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input pl-10 py-2.5 bg-white text-sm"
          />
        </div>
        <Link href="/accounts/create" className="btn-primary flex-shrink-0">
          <Plus className="w-4 h-4" /> Add Account
        </Link>
      </div>
    </div>
  );
}

