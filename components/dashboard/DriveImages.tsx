"use client";

import { useState } from "react";
import { Upload, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadDonationImage, deleteDonationImage, getDonationDriveById } from "@/lib/api_data";

interface DriveImagesProps {
    driveId: string;
    initialImages: { id: string; image: string; created_at: string }[];
    image_urls?: string[]; // New field
    onImagesUpdated: () => void;
}

export default function DriveImages({ driveId, initialImages, image_urls = [], onImagesUpdated }: DriveImagesProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        try {
            setIsUploading(true);
            await uploadDonationImage(driveId, file);
            toast.success("Image uploaded successfully");
            onImagesUpdated();
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            setIsDeleting(imageId);
            await deleteDonationImage(imageId);
            toast.success("Image deleted successfully");
            onImagesUpdated();
        } catch (error) {
            toast.error("Failed to delete image");
        } finally {
            setIsDeleting(null);
        }
    };

    // Combine legacy images and new URL strings
    const allImages = [
        ...initialImages.map(img => ({ ...img, type: 'legacy' })),
        ...(image_urls || []).map((url, index) => ({ id: `url-${index}`, image: url, created_at: '', type: 'url' }))
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-900">Drive Images</h4>
                <div>
                    <label htmlFor="image-upload" className={`flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-bronze transition-colors cursor-pointer text-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="w-4 h-4" />
                        {isUploading ? "Uploading..." : "Add Image"}
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </div>
            </div>

            {allImages.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm">No images attached yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allImages.map((img) => (
                        <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                            <Image
                                src={img.image}
                                alt="Donation Image"
                                fill
                                className="object-cover"
                            />
                            {img.type === 'legacy' && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        disabled={isDeleting === img.id}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
