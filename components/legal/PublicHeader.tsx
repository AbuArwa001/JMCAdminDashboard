import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9">
            <Image
              src="/logo.png"
              alt="Jamia Mosque Committee"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span
              className="text-base font-bold text-gray-900 tracking-tight block leading-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Jamia Mosque
            </span>
            <span className="text-[11px] font-semibold text-[#c99335] tracking-wider uppercase block">
              Committee Nairobi
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/privacy-policy"
            className="text-gray-600 hover:text-[#006838] transition-colors py-1.5"
          >
            Privacy Policy
          </Link>
          <Link
            href="/delete-account"
            className="text-gray-600 hover:text-red-600 transition-colors py-1.5"
          >
            Delete Account
          </Link>
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#c99335]" />
            <span>Admin Portal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

