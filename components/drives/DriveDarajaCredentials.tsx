interface Props {
  formData: any;
  showCustomCreds: boolean;
  onToggleCustomCreds: (show: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CRED_FIELDS = [
  { name: "consumer_key", label: "Consumer Key", placeholder: "WX..." },
  { name: "consumer_secret", label: "Consumer Secret", placeholder: "yZ..." },
  { name: "passkey", label: "Passkey", placeholder: "bfb...", colSpan: true },
  { name: "initiator_name", label: "Initiator Name", placeholder: "testapi" },
  { name: "security_credential", label: "Security Credential (Base64)", placeholder: "Qk..." },
];

export function DriveDarajaCredentials({ formData, showCustomCreds, onToggleCustomCreds, onChange }: Props) {
  return (
    <>
      <div className="col-span-full pt-2 border-t border-gray-200">
        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
          <label className="relative cursor-pointer flex-shrink-0">
            <input type="checkbox" checked={showCustomCreds} onChange={(e) => onToggleCustomCreds(e.target.checked)} className="peer sr-only" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#006838] relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
          </label>
          <div>
            <span className="text-sm font-bold text-gray-800">Custom Daraja API Credentials</span>
            <p className="text-xs text-gray-500 mt-0.5">Optional — override the default API keys for this drive.</p>
          </div>
        </div>
      </div>
      {showCustomCreds && (
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white border border-gray-200 rounded-xl">
          {CRED_FIELDS.map((f) => (
            <div key={f.name} className={f.colSpan ? "col-span-full" : ""}>
              <label className="form-label">{f.label}</label>
              <input type="text" name={f.name} value={formData[f.name] || ""} onChange={onChange} className="form-input font-mono text-sm" placeholder={f.placeholder} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

