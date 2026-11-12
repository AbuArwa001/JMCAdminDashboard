"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

interface Props {
  img: { id: string; image: string };
  isDeleting: boolean;
  onDelete: (val: string) => void;
}

export function DriveImageItem({ img, isDeleting, onDelete }: Props) {
  const src = img.image.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')}${img.image}`
    : img.image;

  return (
    <div className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
      <Image src={src} alt="Donation Image" fill className="object-cover" unoptimized />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button
          onClick={() => onDelete(img.image || img.id)}
          disabled={isDeleting}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
          title="Delete image"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
