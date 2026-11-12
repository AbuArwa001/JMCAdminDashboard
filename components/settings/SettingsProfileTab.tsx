import { User, ShieldAlert, Lock, Save, Loader2 } from "lucide-react";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/Skeleton";

interface Props {
  formData: { name: string; email: string; phone: string };
  initialEmail: string;
  isEmailChanged: boolean;
  isFetching: boolean;
  isSavingProfile: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenEmailModal: () => void;
}

export function SettingsProfileTab({
  formData, initialEmail, isEmailChanged, isFetching, isSavingProfile, onChange, onSubmit, onOpenEmailModal
}: Props) {
  return (
    <>
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-[#c99335]/20 border border-[#c99335]/40 flex items-center justify-center">
          <User className="w-4 h-4 text-[#c99335]" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Profile Information</h3>
          <p className="text-[11px] text-gray-400">Update your personal details and contact info</p>
        </div>
      </div>
      <div className="form-section-body">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Full Name</label>
              {isFetching ? <Skeleton className="h-11 w-full rounded-xl" /> : <input type="text" value={formData.name} onChange={(e) => onChange("name", e.target.value)} className="form-input" placeholder="Your full name" />}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">Email Address</label>
                {isEmailChanged && <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"><ShieldAlert className="w-3 h-3 text-amber-600" />Verification Required</span>}
              </div>
              {isFetching ? <Skeleton className="h-11 w-full rounded-xl" /> : (
                <div className="relative">
                  <input type="email" value={formData.email} onChange={(e) => onChange("email", e.target.value)} className={clsx("form-input", isEmailChanged && "border-amber-400 pr-24")} placeholder="you@example.com" />
                  {isEmailChanged && <button type="button" onClick={onOpenEmailModal} className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1a1512] text-[#c99335] text-[11px] font-bold rounded-lg flex items-center gap-1"><Lock className="w-3 h-3" />Verify</button>}
                </div>
              )}
              {isEmailChanged ? <p className="text-[11px] text-amber-600 mt-1">Original: <strong className="font-mono text-gray-700">{initialEmail}</strong>. Verify to authorize change.</p> : <p className="text-[11px] text-gray-400 mt-1">Primary sign-in credential.</p>}
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              {isFetching ? <Skeleton className="h-11 w-full rounded-xl" /> : <input type="tel" value={formData.phone} onChange={(e) => onChange("phone", e.target.value)} className="form-input" placeholder="+254 700 000000" />}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isSavingProfile || isFetching} className="btn-primary">
              {isSavingProfile ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></> : <><Save className="w-4 h-4" /><span>Save Profile Changes</span></>}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
