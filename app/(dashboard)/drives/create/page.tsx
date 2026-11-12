"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryData, BankAccount } from "@/lib/data";
import { createDonationDrive, getCategories, getBankAccounts } from "@/lib/api_data";
import { toast } from "sonner";
import { ButtonShimmer } from "@/components/ui/Skeleton";
import { DriveBasicFields } from "@/components/drives/DriveBasicFields";
import { DriveDescriptionSection } from "@/components/drives/DriveDescriptionSection";
import { DriveMediaUpload } from "@/components/drives/DriveMediaUpload";
import { DrivePaymentSection } from "@/components/drives/DrivePaymentSection";
import { useDriveForm } from "@/hooks/use-drive-form";

export default function CreateDrivePage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "BANK">("MPESA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("manual");
  const [showCustomCreds, setShowCustomCreds] = useState(false);

  const { formData, setFormData, handleChange, updateField } = useDriveForm({
    title: "", category: "", start_date: "", end_date: "", target_amount: 0, description: "",
    paybill_number: "", account_name: "", account_number: "", consumer_key: "", consumer_secret: "",
    passkey: "", initiator_name: "", security_credential: "", is_featured: false,
  });

  useEffect(() => {
    Promise.all([getCategories(), getBankAccounts()])
      .then(([cats, accs]) => { setCategories(cats); setAccounts(accs); })
      .catch((err) => console.error("Error fetching data", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createDonationDrive({ ...formData, uploaded_images: selectedImages });
      toast.success("Donation Drive created! Mobile users notified. 🔔");
      router.push("/drives");
    } catch {
      toast.error("Failed to create drive.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccountSelect = (id: string) => {
    setSelectedAccountId(id);
    if (id !== "manual") {
      const acc = accounts.find((a) => a.id === id);
      if (acc) {
        setFormData((prev) => ({ ...prev, paybill_number: acc.paybill_number || "", account_name: acc.account_name || "", account_number: acc.account_number || "" }));
        setPaymentMethod(acc.bank_name.toLowerCase().includes("mpesa") ? "MPESA" : "BANK");
      }
    } else {
      setFormData((prev) => ({ ...prev, paybill_number: "", account_name: "", account_number: "", consumer_key: "", consumer_secret: "", passkey: "", initiator_name: "", security_credential: "" }));
      setShowCustomCreds(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/drives" className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-500 border border-gray-200">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512]" style={{ fontFamily: "var(--font-cinzel), serif" }}>Create Donation Drive</h1>
          <p className="text-sm text-gray-500 mt-0.5">Launch a new fundraising campaign for the community.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <DriveBasicFields formData={formData} categories={categories} onChange={handleChange} />
        <DriveDescriptionSection description={formData.description} onChange={(v) => updateField("description", v)} />
        <DriveMediaUpload selectedImages={selectedImages} imagePreviews={imagePreviews} isFeatured={formData.is_featured} onSelectImages={(files, prevs) => { setSelectedImages(files); setImagePreviews(prevs); }} onRemoveImage={(idx) => { setSelectedImages((p) => p.filter((_, i) => i !== idx)); setImagePreviews((p) => p.filter((_, i) => i !== idx)); }} onToggleFeatured={(val) => updateField("is_featured", val)} />
        <DrivePaymentSection formData={formData} accounts={accounts} paymentMethod={paymentMethod} selectedAccountId={selectedAccountId} showCustomCreds={showCustomCreds} onSetPaymentMethod={setPaymentMethod} onAccountSelect={handleAccountSelect} onToggleCustomCreds={setShowCustomCreds} onChange={handleChange} />
        <div className="flex items-center justify-between pt-2">
          <Link href="/drives" className="btn-secondary"><ArrowLeft className="w-4 h-4" /> Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:cursor-not-allowed p-0 overflow-hidden">
            <ButtonShimmer isLoading={isSubmitting} className="w-full h-full px-4 py-2 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Create Drive</ButtonShimmer>
          </button>
        </div>
      </form>
    </div>
  );
}
