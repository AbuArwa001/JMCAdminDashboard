import { ShieldCheck, Calendar } from "lucide-react";

export function PrivacyHero() {
  return (
    <div className="text-center space-y-3 pb-8 border-b border-gray-200">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#006838] border border-emerald-200/80">
        <ShieldCheck className="w-4 h-4 text-[#006838]" />
        <span>Official Privacy & Data Protection Policy</span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
        style={{ fontFamily: "var(--font-cinzel), serif" }}
      >
        Privacy Policy
      </h1>

      <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        This Privacy Policy explains how the Jamia Mosque Committee (&quot;JMC&quot;, &quot;we&quot;, &quot;us&quot;) collects, uses, protects, and discloses your personal information when using the <strong>Jamia Mosque (Jamia Give)</strong> mobile application and related digital services.
      </p>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
        <Calendar className="w-3.5 h-3.5" />
        <span>Last Updated: November 25, 2026</span>
      </div>
    </div>
  );
}

