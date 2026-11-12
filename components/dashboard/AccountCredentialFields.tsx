import { CreditCard } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  isPaybill: boolean;
  isActive: boolean;
  onActiveChange: (val: boolean) => void;
}

export function AccountCredentialFields({ register, errors, isPaybill, isActive, onActiveChange }: Props) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Account Credentials
          </h3>
          <p className="text-[11px] text-gray-400">Beneficiary account name & number</p>
        </div>
      </div>

      <div className="form-section-body space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              Account Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              {...register("account_name", { required: "Account name is required" })}
              placeholder="e.g. Jamia Mosque Committee"
              className="form-input"
            />
            {errors.account_name && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.account_name.message as string}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              {isPaybill ? "Account Reference" : "Account Number"} <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              {...register("account_number", { required: "Account number/reference is required" })}
              placeholder={isPaybill ? "e.g. Education Fund" : "e.g. 1234567890"}
              className="form-input font-mono"
            />
            {errors.account_number && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.account_number.message as string}</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <ToggleSwitch
            checked={isActive}
            onChange={onActiveChange}
            label="Active Beneficiary Channel"
            description="Enable this account for internal transfers and automated payouts."
          />
        </div>
      </div>
    </div>
  );
}
