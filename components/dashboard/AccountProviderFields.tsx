import { Building } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function AccountProviderFields({ register, errors }: Props) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
          <Building className="w-4 h-4 text-[#c99335]" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Provider Information
          </h3>
          <p className="text-[11px] text-gray-400">Bank name and MPESA paybill number</p>
        </div>
      </div>

      <div className="form-section-body space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              Bank / Provider Name <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              {...register("bank_name", { required: "Provider name is required" })}
              placeholder="e.g. MPESA Paybill, Equity Bank, KCB"
              className="form-input"
            />
            {errors.bank_name && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.bank_name.message as string}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Paybill Number <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input {...register("paybill_number")} placeholder="e.g. 522522" className="form-input font-mono" />
          </div>
        </div>
      </div>
    </div>
  );
}
