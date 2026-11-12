import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="text-center space-y-2 mb-6">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
          Jamia Mosque Nairobi
        </h1>
        <p className="text-xs font-semibold text-[#c99335] uppercase tracking-widest flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Executive Administrator Portal
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-xs text-gray-400 mt-6">
        Need staff authorization? Contact your Super Administrator.
      </p>
    </>
  );
}
