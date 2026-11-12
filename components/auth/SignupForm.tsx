"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { finalizeLogin, mapFirebaseAuthError } from "@/lib/auth-helpers";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(cred.user, { displayName: formData.name });
      const token = await cred.user.getIdToken();
      finalizeLogin(cred.user, token);
      toast.success("Account created successfully!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(mapFirebaseAuthError(err?.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
        <input name="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your Name" className="form-input text-sm" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
        <input name="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@jmc.org" className="form-input text-sm" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
        <div className="relative">
          <input name="password" type={showPass ? "text" : "password"} required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="form-input text-sm pr-10" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Confirm Password</label>
        <input name="confirmPassword" type={showPass ? "text" : "password"} required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" className="form-input text-sm" />
      </div>
      <button type="submit" disabled={isLoading} className="w-full btn-primary py-3">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sign Up"}
      </button>
    </form>
  );
}
