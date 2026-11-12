"use client";

import Image from "next/image";
import { Upload, ImageIcon, X, Star } from "lucide-react";
import { toast } from "sonner";

interface Props {
  selectedImages: File[];
  imagePreviews: string[];
  isFeatured: boolean;
  onSelectImages: (files: File[], previews: string[]) => void;
  onRemoveImage: (idx: number) => void;
  onToggleFeatured: (val: boolean) => void;
}

export function DriveMediaUpload({
  selectedImages, imagePreviews, isFeatured, onSelectImages, onRemoveImage, onToggleFeatured,
}: Props) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error("Maximum 4 images allowed.");
      return;
    }
    onSelectImages(files, files.map((f) => URL.createObjectURL(f)));
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Drive Images</h3>
          <p className="text-[11px] text-gray-400">Upload up to 4 images for the campaign</p>
        </div>
      </div>
      <div className="form-section-body">
        <div className="relative border-2 border-dashed border-gray-200 hover:border-[#c99335]/50 rounded-xl p-8 text-center transition-all cursor-pointer group bg-gray-50 hover:bg-amber-50/30">
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 group-hover:border-[#c99335]/40 flex items-center justify-center shadow-sm">
              <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#c99335]" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">Click to upload images</p>
              <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB · Max 4 images</p>
            </div>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-100">
                <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                <button type="button" onClick={() => onRemoveImage(i)} className="absolute top-1 right-1 p-1 bg-[#1a1512]/70 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-[#c99335] text-white px-1.5 py-0.5 rounded-md">Cover</span>}
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 flex items-center gap-4 p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl">
          <label className="relative cursor-pointer flex-shrink-0">
            <input type="checkbox" checked={isFeatured} onChange={(e) => onToggleFeatured(e.target.checked)} className="peer sr-only" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#006838] peer-focus:ring-4 peer-focus:ring-[#006838]/20 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
          </label>
          <div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-[#c99335]" /><span className="text-sm font-bold text-gray-900">Feature this Drive</span></div>
            <p className="text-xs text-gray-500 mt-0.5">Featured drives appear on the JamiaGive App Home Page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
