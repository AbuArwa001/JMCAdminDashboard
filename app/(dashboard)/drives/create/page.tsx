"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CategoryData, BankAccount } from "@/lib/data";
import {
  createDonationDrive,
  getCategories,
  getBankAccounts,
} from "@/lib/api_data";
import { toast } from "sonner";

export default function CreateDrivePage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "BANK">("MPESA");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  });
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("manual");
  
  console.log("Categories:", categories);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats: CategoryData[] = await getCategories();
        setCategories(cats);
        
        const accs: BankAccount[] = await getBankAccounts();
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
      await createDonationDrive({
        ...formData,
        uploaded_images: selectedImages
      });

      console.log({ ...formData, paymentMethod });
      toast.success("Donation Drive created! Mobile users notified. 🔔");
      router.push("/drives");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create drive.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/drives"
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Create Donation Drive
        </h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drive Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Ramadan Food Drive 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_name} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount (KES)
              </label>
              <input
                type="number"
                name="target_amount"
                required
                value={formData.target_amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Describe the purpose of this drive..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drive Images (Max 4)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    if (files.length > 4) {
                      alert("You can only upload a maximum of 4 images.");
                      return;
                    }
                    setSelectedImages(files);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500">
                {selectedImages.length > 0
                  ? `${selectedImages.length} image(s) selected: ${selectedImages.map((f) => f.name).join(", ")}`
                  : "Click to upload images (Max 4)"}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Payment Configuration
            </h3>

            <div className="flex gap-6 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "MPESA"}
                  onChange={() => setPaymentMethod("MPESA")}
                  className="text-primary focus:ring-primary"
                />
                <span className="font-medium text-gray-700">
                  M-Pesa Paybill
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "BANK"}
                  onChange={() => setPaymentMethod("BANK")}
                  className="text-primary focus:ring-primary"
                />
                <span className="font-medium text-gray-700">Bank Account</span>
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Existing Account (Optional)
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => {
                  const id = e.target.value;
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
                      // Auto-select method based on bank name if possible
                      if (acc.bank_name.toLowerCase().includes("mpesa")) {
                        setPaymentMethod("MPESA");
                      } else {
                        setPaymentMethod("BANK");
                      }
                    }
                  } else {
                    // Clear fields if manual is selected again
                    setFormData({
                      ...formData,
                      paybill_number: "",
                      account_name: "",
                      account_number: "",
                    });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              >
                <option value="manual">-- Enter Details Manually --</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.bank_name} - {acc.account_name} ({acc.paybill_number ? `Paybill: ${acc.paybill_number}` : `Acc: ${acc.account_number}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              {paymentMethod === "MPESA" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paybill Number
                    </label>
                    <input
                      type="text"
                      name="paybill_number"
                      value={formData.paybill_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. 247247"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      type="text"
                      name="account_name"
                      value={formData.account_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="e.g. JMC Donation"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Paybill / Code
                    </label>
                    <input
                      type="text"
                      name="paybill_number"
                      value={formData.paybill_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Bank Code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Account Number"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Create Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
