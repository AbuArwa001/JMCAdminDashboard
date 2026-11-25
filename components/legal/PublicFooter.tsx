import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-10 mt-16 text-xs text-gray-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-semibold text-gray-800">
              Jamia Mosque Committee (JMC), Nairobi
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-[#c99335]" />
              Banda Street, P.O. Box 40629 - 00100, Nairobi, Kenya
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/delete-account"
              className="hover:text-gray-900 transition-colors"
            >
              Data & Account Deletion
            </Link>
            <a
              href="mailto:support@jamiamosque.co.ke"
              className="flex items-center gap-1 text-[#006838] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              support@jamiamosque.co.ke
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>© {currentYear} Jamia Mosque Committee. All rights reserved.</p>
          <p>Compliant with Google Play Developer Policies & Kenya Data Protection Act.</p>
        </div>
      </div>
    </footer>
  );
}

