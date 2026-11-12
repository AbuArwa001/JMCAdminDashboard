"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BankAccount } from "@/lib/data";
import { addBankAccount, updateBankAccount } from "@/lib/api_data";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AccountProviderFields } from "./AccountProviderFields";
import { AccountCredentialFields } from "./AccountCredentialFields";
import { AccountDarajaFields } from "./AccountDarajaFields";

interface AccountFormProps {
  initialData?: BankAccount;
  isEdit?: boolean;
}

export default function AccountForm({ initialData, isEdit = false }: AccountFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
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
      toast.error(err.response?.data?.error || "Failed to save account details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <AccountProviderFields register={register} errors={errors} />
      <AccountCredentialFields register={register} errors={errors} isPaybill={Boolean(watch("paybill_number"))} isActive={watch("is_active")} onActiveChange={(val) => setValue("is_active", val)} />
      <AccountDarajaFields register={register} />

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving Account...</> : <><Save className="w-4 h-4" /> {isEdit ? "Update Account" : "Save Account"}</>}
        </button>
      </div>
    </form>
  );
}
