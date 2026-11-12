import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Props {
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function KhutbaPhotoInput({ photoPreview, onPhotoChange, onClear }: Props) {
  return (
    <div>
      <label className="form-label">Imam Photo (Optional)</label>
      {photoPreview ? (
        <div className="relative inline-block">
          <Image src={photoPreview} alt="Imam preview" width={80} height={80} className="w-20 h-20 rounded-xl object-cover border-2 border-[#c99335]/30" />
          <button type="button" onClick={onClear} className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-full shadow-md">
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#c99335]/40 rounded-xl cursor-pointer">
          <Upload className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">Click to upload photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
        </label>
      )}
    </div>
  );
}
