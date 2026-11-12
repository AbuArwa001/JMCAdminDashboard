import { Key } from "lucide-react";
import { UseFormRegister } from "react-hook-form";

export function AccountDarajaFields({ register }: { register: UseFormRegister<any> }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
          <Key className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Daraja API Integration Credentials
          </h3>
          <p className="text-[11px] text-gray-400">Optional — custom M-Pesa B2C/B2B credentials for this account</p>
        </div>
      </div>

      <div className="form-section-body space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Consumer Key</label>
            <input {...register("consumer_key")} placeholder="e.g. WX..." className="form-input font-mono text-sm" />
          </div>
          <div>
            <label className="form-label">Consumer Secret</label>
            <input {...register("consumer_secret")} placeholder="e.g. yZ..." className="form-input font-mono text-sm" />
          </div>
          <div className="col-span-full">
            <label className="form-label">Passkey</label>
            <input {...register("passkey")} placeholder="e.g. bfb..." className="form-input font-mono text-sm" />
          </div>
          <div>
            <label className="form-label">Initiator Name (B2B)</label>
            <input {...register("initiator_name")} placeholder="e.g. testapi" className="form-input font-mono text-sm" />
          </div>
          <div>
            <label className="form-label">Security Credential (Base64 Cert)</label>
            <input {...register("security_credential")} placeholder="e.g. Qk..." className="form-input font-mono text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

