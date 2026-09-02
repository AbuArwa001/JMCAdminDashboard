import Image from "next/image";
import { ShieldCheck, HeartHandshake, Lock } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 font-sans">
      {/* Left Side - Form Container */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>

      {/* Right Side - Premium Jamia Branding Section */}
      <div className="hidden lg:flex flex-col items-center justify-center relative bg-[#1a1512] overflow-hidden">
        {/* Background Radial & Decorative Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#2d2520] via-[#1a1512] to-[#120e0c] opacity-95" />

        {/* Ambient Decorative Blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c99335]/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#006838]/15 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 text-center px-12 space-y-8 max-w-lg">
          {/* Logo Frame */}
          <div className="relative w-28 h-28 mx-auto bg-[#120e0c] rounded-2xl p-4 border border-[#c99335]/40 shadow-2xl shadow-[#c99335]/10 transition-transform duration-500 hover:scale-105">
            <Image
              src="/logo.png"
              alt="JMC Logo"
              fill
              className="object-contain p-2"
              priority
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#120e0c] rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c99335]/15 border border-[#c99335]/30 rounded-full text-[#c99335] text-xs font-semibold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Executive Portal
            </div>
            <h2
              className="text-3xl xl:text-4xl font-bold text-white tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Jamia Mosque <br />
              <span className="text-[#c99335]">Committee Admin</span>
            </h2>
            <p className="text-gray-400 text-sm xl:text-base leading-relaxed font-medium pt-1">
              Centralized platform for transparent donation tracking, financial auditing, and administration of Jamia Mosque community initiatives.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white/90 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live MPESA Integration
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-white/90 text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5 text-[#c99335]" />
              Donation Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
