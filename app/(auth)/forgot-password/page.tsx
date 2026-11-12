import Image from "next/image";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="text-center space-y-2">
        <div className="relative w-20 h-20 mx-auto" style={{ width: '100px', height: '100px' }}>
          <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-500">Enter your email to receive a password reset link</p>
      </div>

      <ForgotPasswordForm />

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </>
  );
}
