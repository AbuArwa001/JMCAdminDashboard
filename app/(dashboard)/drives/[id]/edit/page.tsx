"use client";

import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useDriveEdit } from "@/hooks/use-drive-edit";
import { DriveEditFields } from "@/components/drives/DriveEditFields";
import { DriveEditPayment } from "@/components/drives/DriveEditPayment";

export default function EditDrivePage({ params }: { params: { id: string } }) {
  const {
    loading, error, categories, formData, paymentMethod, selectedImages,
    setSelectedImages, setPaymentMethod, handleChange, handleSubmit
  } = useDriveEdit(params.id);

  if (loading) return <div className="p-8 text-center">Loading drive details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/drives" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Donation Drive</h1>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DriveEditFields formData={formData} categories={categories} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images (Max 4)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file" accept="image/*" multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    if (files.length > 4) { toast.error("You can only upload a maximum of 4 images."); return; }
                    setSelectedImages(files);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-500">
                {selectedImages.length > 0 ? `${selectedImages.length} image(s) selected: ${selectedImages.map((f) => f.name).join(", ")}` : "Click to upload new images (Max 4)"}
              </span>
            </div>
          </div>

          <DriveEditPayment formData={formData} paymentMethod={paymentMethod} onSetPaymentMethod={setPaymentMethod} onChange={handleChange} />

          <div className="flex justify-end pt-4">
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors font-medium">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
