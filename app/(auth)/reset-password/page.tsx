import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ResetPasswordLoading } from "@/components/auth/ResetPasswordStatus";

export default function ResetPasswordPage() {
  return (
    <>
      <div className="text-center space-y-2 mb-6">
        <div className="relative w-16 h-16 mx-auto mb-3">
          <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
          Set New Password
        </h1>
        <p className="text-xs text-gray-500">Enter your new administrator account password</p>
      </div>

      <Suspense fallback={<ResetPasswordLoading />}>
        <ResetPasswordForm />
      </Suspense>

      <p className="text-center text-xs text-gray-400 mt-6">
        Remember your password?{" "}
        <Link href="/login" className="text-[#c99335] hover:underline font-semibold">Sign in here</Link>
      </p>
    </>
  );
}
