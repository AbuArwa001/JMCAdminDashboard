import Image from "next/image";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <>
      <div className="text-center space-y-2">
        <div className="relative w-20 h-20 mx-auto" style={{ width: '80px', height: '80px' }}>
          <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Staff Account</h1>
        <p className="text-gray-500 text-xs">Enter your details to register</p>
      </div>

      <SignupForm />

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </>
  );
}
