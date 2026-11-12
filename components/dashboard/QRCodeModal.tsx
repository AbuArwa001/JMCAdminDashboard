"use client";

import { X, Download, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { downloadQrSvg } from "@/lib/download-qr";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  title: string;
}

export default function QRCodeModal({ isOpen, onClose, value, title }: QRCodeModalProps) {
  const qrRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 p-6 text-center">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Donation QR Code</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block mb-6">
          <QRCodeSVG value={value} size={200} level="H" includeMargin ref={qrRef} />
        </div>
        <p className="text-sm text-gray-500 mb-6 font-medium">Scan to donate to <br /><span className="text-primary font-bold">{title}</span></p>
        <div className="space-y-3">
          <button onClick={() => downloadQrSvg(qrRef.current, title)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Download QR Code
          </button>
          <button onClick={() => { navigator.clipboard.writeText(value); toast.success("Link copied to clipboard"); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
            <Copy className="w-4 h-4" /> Copy Deep Link
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
