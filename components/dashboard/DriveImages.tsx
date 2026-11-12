"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadDonationImage, deleteDonationImage } from "@/lib/api_data";
import { DriveImageItem } from "./DriveImageItem";

interface DriveImagesProps {
  driveId: string;
  initialImages: { id: string; image: string; created_at: string }[];
  image_urls?: string[];
  onImagesUpdated: () => void;
}

export default function DriveImages({ driveId, initialImages, image_urls = [], onImagesUpdated }: DriveImagesProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      setIsUploading(true);
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("image/")) await uploadDonationImage(driveId, files[i]);
      }
      toast.success("Image(s) uploaded successfully");
      onImagesUpdated();
    } catch { toast.error("Failed to upload image(s)"); }
    finally { setIsUploading(false); e.target.value = ""; }
  };

  const handleDelete = async (val: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      setIsDeleting(val);
      await deleteDonationImage(driveId, val);
      toast.success("Image deleted");
      onImagesUpdated();
    } catch { toast.error("Failed to delete image"); }
    finally { setIsDeleting(null); }
  };

  const allImages = [
    ...initialImages.map(img => ({ ...img, type: 'legacy' })),
    ...(image_urls || []).map((url, i) => ({ id: `url-${i}`, image: url, created_at: '', type: 'url' }))
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-900">Drive Images</h4>
        <div>
          <label htmlFor="image-upload" className={`flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors cursor-pointer text-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" /> {isUploading ? "Uploading..." : "Add Images"}
          </label>
          <input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} disabled={isUploading} />
        </div>
      </div>
      {allImages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500 text-sm">No images attached yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allImages.map((img) => (
            <DriveImageItem key={img.id} img={img} isDeleting={isDeleting === (img.image || img.id)} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
