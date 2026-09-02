"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BankAccount } from "@/lib/data";
import { addBankAccount, updateBankAccount } from "@/lib/api_data";
import {
  Loader2,
  Save,
  Building,
  CreditCard,
  Key,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface AccountFormProps {
  initialData?: BankAccount;
  isEdit?: boolean;
}

export default function AccountForm({
  initialData,
  isEdit = false,
}: AccountFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bank_name: initialData?.bank_name || "",
      paybill_number: initialData?.paybill_number || "",
      account_number: initialData?.account_number || "",
      account_name: initialData?.account_name || "",
      is_active: initialData?.is_active ?? true,
      consumer_key: initialData?.consumer_key || "",
      consumer_secret: initialData?.consumer_secret || "",
      passkey: initialData?.passkey || "",
      initiator_name: initialData?.initiator_name || "",
      security_credential: initialData?.security_credential || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialData) {
        await updateBankAccount(initialData.id, data);
        toast.success("Account updated successfully.");
      } else {
        await addBankAccount(data);
        toast.success("Account created successfully.");
      }
      router.push("/accounts");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to save account details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPaybill = watch("paybill_number");
  const isActive = watch("is_active");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      {/* ── Section 1: Provider Details ── */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
            <Building className="w-4 h-4 text-[#c99335]" />
          </div>
          <div>
            <h3
              className="font-bold text-sm tracking-wide"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
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
                {...register("bank_name", {
                  required: "Provider name is required",
                })}
                placeholder="e.g. MPESA Paybill, Equity Bank, KCB"
                className="form-input"
              />
              {errors.bank_name && (
                <p className="text-rose-500 text-xs mt-1 font-medium">
                  {errors.bank_name.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">
                Paybill Number <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                {...register("paybill_number")}
                placeholder="e.g. 522522"
                className="form-input font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Account Details ── */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3
              className="font-bold text-sm tracking-wide"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
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
                {...register("account_name", {
                  required: "Account name is required",
                })}
                placeholder="e.g. Jamia Mosque Committee"
                className="form-input"
              />
              {errors.account_name && (
                <p className="text-rose-500 text-xs mt-1 font-medium">
                  {errors.account_name.message as string}
                </p>
              )}
            </div>

            <div>
              <label className="form-label">
                {isPaybill ? "Account Reference" : "Account Number"}{" "}
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                {...register("account_number", {
                  required: "Account number/reference is required",
                })}
                placeholder={isPaybill ? "e.g. Education Fund" : "e.g. 1234567890"}
                className="form-input font-mono"
              />
              {errors.account_number && (
                <p className="text-rose-500 text-xs mt-1 font-medium">
                  {errors.account_number.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ToggleSwitch
              checked={isActive}
              onChange={(val) => setValue("is_active", val)}
              label="Active Beneficiary Channel"
              description="Enable this account for internal transfers and automated payouts."
            />
          </div>
        </div>
      </div>

      {/* ── Section 3: Daraja API Credentials ── */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
            <Key className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3
              className="font-bold text-sm tracking-wide"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Daraja API Integration Credentials
            </h3>
            <p className="text-[11px] text-gray-400">
              Optional — custom M-Pesa B2C/B2B credentials for this account
            </p>
          </div>
        </div>

        <div className="form-section-body space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Consumer Key</label>
              <input
                {...register("consumer_key")}
                placeholder="e.g. WX..."
                className="form-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="form-label">Consumer Secret</label>
              <input
                {...register("consumer_secret")}
                placeholder="e.g. yZ..."
                className="form-input font-mono text-sm"
              />
            </div>

            <div className="col-span-full">
              <label className="form-label">Passkey</label>
              <input
                {...register("passkey")}
                placeholder="e.g. bfb..."
                className="form-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="form-label">Initiator Name (B2B)</label>
              <input
                {...register("initiator_name")}
                placeholder="e.g. testapi"
                className="form-input font-mono text-sm"
              />
            </div>

            <div>
              <label className="form-label">Security Credential (Base64 Cert)</label>
              <input
                {...register("security_credential")}
                placeholder="e.g. Qk..."
                className="form-input font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Account...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? "Update Account" : "Save Account"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
