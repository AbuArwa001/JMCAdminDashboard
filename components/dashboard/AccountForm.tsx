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
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";

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
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bank_name: initialData?.bank_name || "",
      paybill_number: initialData?.paybill_number || "",
      account_number: initialData?.account_number || "",
      account_name: initialData?.account_name || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (isEdit && initialData) {
        await updateBankAccount(initialData.id, data);
      } else {
        await addBankAccount(data);
      }
      router.push("/accounts");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPaybill = watch("paybill_number");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-3xl mx-auto"
    >
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <div className="w-1 h-8 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section: Provider Details */}
        <div className="col-span-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-secondary rounded-lg">
              <Building className="w-4 h-4 text-primary-bronze" />
            </div>
            Provider Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="col-span-full md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank / Provider Name
              </label>
              <input
                {...register("bank_name", {
                  required: "Provider name is required",
                })}
                placeholder="e.g. MPESA Paybill, Equity Bank"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-400"
              />
              {errors.bank_name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.bank_name.message as string}
                </p>
              )}
            </div>

            <div className="col-span-full md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paybill Number{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                {...register("paybill_number")}
                placeholder="e.g. 522522"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Section: Account Details */}
        <div className="col-span-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-1.5 bg-secondary rounded-lg">
              <CreditCard className="w-4 h-4 text-primary-bronze" />
            </div>
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <input
                {...register("account_name", {
                  required: "Account name is required",
                })}
                placeholder="e.g. Jamia Mosque Committee"
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium placeholder:text-gray-400"
              />
              {errors.account_name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.account_name.message as string}
                </p>
              )}
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isPaybill ? "Account Reference" : "Account Number"}
              </label>
              <input
                {...register("account_number", {
                  required: "Account number/reference is required",
                })}
                placeholder={
                  isPaybill ? "e.g. Account Name" : "e.g. 1234567890"
                }
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono placeholder:text-gray-400"
              />
              {errors.account_number && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.account_number.message as string}
                </p>
              )}
            </div>

            <div className="col-span-full pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                  Active Account (Available for transfers)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-bronze text-white rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium transform active:scale-95"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isEdit ? "Update Account" : "Save Account"}
        </button>
      </div>
    </form>
  );
}
