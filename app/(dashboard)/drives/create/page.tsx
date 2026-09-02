"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft, Save, Upload, ImageIcon, X, CreditCard,
  Smartphone, Building2, Star, Info, ChevronDown, Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryData, BankAccount } from "@/lib/data";
import { createDonationDrive, getCategories, getBankAccounts } from "@/lib/api_data";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import Image from "next/image";

export default function CreateDrivePage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "BANK">("MPESA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    start_date: "",
    end_date: "",
    target_amount: 0,
    description: "",
    paybill_number: "",
    account_name: "",
    account_number: "",
    consumer_key: "",
    consumer_secret: "",
    passkey: "",
    initiator_name: "",
    security_credential: "",
    is_featured: false,
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("manual");
  const [showCustomCreds, setShowCustomCreds] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, accs] = await Promise.all([getCategories(), getBankAccounts()]);
        setCategories(cats);
        setAccounts(accs);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await createDonationDrive({ ...formData, uploaded_images: selectedImages });
      toast.success("Donation Drive created! Mobile users notified. 🔔");
      router.push("/drives");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create drive.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error("Maximum 4 images allowed.");
      return;
    }
    setSelectedImages(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
  };

  const removeImage = (idx: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== idx);
    const newPreviews = imagePreviews.filter((_, i) => i !== idx);
    setSelectedImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleAccountSelect = (id: string) => {
    setSelectedAccountId(id);
    if (id !== "manual") {
      const acc = accounts.find((a) => a.id === id);
      if (acc) {
        setFormData({
          ...formData,
          paybill_number: acc.paybill_number || "",
          account_name: acc.account_name || "",
          account_number: acc.account_number || "",
        });
        setPaymentMethod(acc.bank_name.toLowerCase().includes("mpesa") ? "MPESA" : "BANK");
      }
    } else {
      setFormData({
        ...formData,
        paybill_number: "",
        account_name: "",
        account_number: "",
        consumer_key: "",
        consumer_secret: "",
        passkey: "",
        initiator_name: "",
        security_credential: "",
      });
      setShowCustomCreds(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/drives"
          className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 border border-gray-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Create Donation Drive
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Launch a new fundraising campaign for the community.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Section 1: Basic Information ── */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
              <Info className="w-4 h-4 text-[#c99335]" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                Basic Information
              </h3>
              <p className="text-[11px] text-gray-400">Drive title, category, and duration</p>
            </div>
          </div>
          <div className="form-section-body space-y-5">
            {/* Title */}
            <div>
              <label className="form-label">Drive Title <span className="text-rose-500 normal-case font-bold">*</span></label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Ramadan Food Drive 2025"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label className="form-label">Category <span className="text-rose-500 normal-case font-bold">*</span></label>
                <div className="relative">
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="form-input appearance-none pr-10 cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Target Amount */}
              <div>
                <label className="form-label">Target Amount (KES) <span className="text-rose-500 normal-case font-bold">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">KES</span>
                  <input
                    type="number"
                    name="target_amount"
                    required
                    min={0}
                    value={formData.target_amount || ""}
                    onChange={handleChange}
                    className="form-input pl-14"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="form-label">Start Date <span className="text-rose-500 normal-case font-bold">*</span></label>
                <input
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Description ── */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                Drive Description
              </h3>
              <p className="text-[11px] text-gray-400">Describe the purpose and impact of this drive</p>
            </div>
          </div>
          <div className="form-section-body">
            <label className="form-label">Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="Describe the purpose of this drive, who it benefits, and how funds will be used..."
              minHeight={240}
            />
          </div>
        </div>

        {/* ── Section 3: Media ── */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                Drive Images
              </h3>
              <p className="text-[11px] text-gray-400">Upload up to 4 images for the campaign</p>
            </div>
          </div>
          <div className="form-section-body">
            {/* Upload Zone */}
            <div className="relative border-2 border-dashed border-gray-200 hover:border-[#c99335]/50 rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group bg-gray-50 hover:bg-amber-50/30">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 group-hover:border-[#c99335]/40 flex items-center justify-center shadow-sm transition-all">
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#c99335] transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-[#1a1512] transition-colors">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB each · Max 4 images</p>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                    <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1 bg-[#1a1512]/70 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-[#c99335] text-white px-1.5 py-0.5 rounded-md">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Featured toggle */}
            <div className="mt-5 flex items-center gap-4 p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl">
              <label className="relative cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:border-white" />
              </label>
              <div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#c99335]" />
                  <span className="text-sm font-bold text-gray-900">Feature this Drive</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Featured drives appear on the JamiaGive App Home Page.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: Payment Configuration ── */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                Payment Configuration
              </h3>
              <p className="text-[11px] text-gray-400">M-Pesa paybill or bank account details</p>
            </div>
          </div>
          <div className="form-section-body space-y-6">

            {/* Payment Method Toggle */}
            <div className="flex gap-3">
              {(["MPESA", "BANK"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-2.5 flex-1 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                    paymentMethod === method
                      ? "border-[#006838] bg-emerald-50 text-[#006838]"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {method === "MPESA" ? (
                    <Smartphone className={`w-4 h-4 ${paymentMethod === "MPESA" ? "text-[#006838]" : "text-gray-400"}`} />
                  ) : (
                    <Building2 className={`w-4 h-4 ${paymentMethod === "BANK" ? "text-[#006838]" : "text-gray-400"}`} />
                  )}
                  {method === "MPESA" ? "M-Pesa Paybill" : "Bank Account"}
                </button>
              ))}
            </div>

            {/* Select Existing Account */}
            <div>
              <label className="form-label">Select Existing Account (Optional)</label>
              <div className="relative">
                <select
                  value={selectedAccountId}
                  onChange={(e) => handleAccountSelect(e.target.value)}
                  className="form-input appearance-none pr-10 cursor-pointer"
                >
                  <option value="manual">— Enter Details Manually —</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bank_name} - {acc.account_name} (
                      {acc.paybill_number ? `Paybill: ${acc.paybill_number}` : `Acc: ${acc.account_number}`})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Payment Details Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
              {paymentMethod === "MPESA" ? (
                <>
                  <div>
                    <label className="form-label">Paybill Number</label>
                    <input type="text" name="paybill_number" value={formData.paybill_number} onChange={handleChange} className="form-input" placeholder="e.g. 247247" />
                  </div>
                  <div>
                    <label className="form-label">Account Name</label>
                    <input type="text" name="account_name" value={formData.account_name} onChange={handleChange} className="form-input" placeholder="e.g. JMC Donation" />
                  </div>

                  {/* Custom Daraja Credentials Toggle */}
                  <div className="col-span-full pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
                      <label className="relative cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={showCustomCreds}
                          onChange={(e) => setShowCustomCreds(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all after:duration-200 peer-checked:after:translate-x-5 peer-checked:after:border-white" />
                      </label>
                      <div>
                        <span className="text-sm font-bold text-gray-800">Custom Daraja API Credentials</span>
                        <p className="text-xs text-gray-500 mt-0.5">Optional — override the default API keys for this drive.</p>
                      </div>
                    </div>
                  </div>

                  {showCustomCreds && (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white border border-gray-200 rounded-xl">
                      {[
                        { name: "consumer_key", label: "Consumer Key", placeholder: "WX..." },
                        { name: "consumer_secret", label: "Consumer Secret", placeholder: "yZ..." },
                        { name: "passkey", label: "Passkey", placeholder: "bfb...", colSpan: true },
                        { name: "initiator_name", label: "Initiator Name", placeholder: "testapi" },
                        { name: "security_credential", label: "Security Credential (Base64)", placeholder: "Qk..." },
                      ].map((field) => (
                        <div key={field.name} className={field.colSpan ? "col-span-full" : ""}>
                          <label className="form-label">{field.label}</label>
                          <input
                            type="text"
                            name={field.name}
                            value={(formData as any)[field.name]}
                            onChange={handleChange}
                            className="form-input font-mono text-sm"
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="form-label">Bank Paybill / Code</label>
                    <input type="text" name="paybill_number" value={formData.paybill_number} onChange={handleChange} className="form-input" placeholder="Bank Code" />
                  </div>
                  <div>
                    <label className="form-label">Account Number</label>
                    <input type="text" name="account_number" value={formData.account_number} onChange={handleChange} className="form-input" placeholder="Account Number" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Submit Bar ── */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/drives" className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Drive...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Create Drive
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
