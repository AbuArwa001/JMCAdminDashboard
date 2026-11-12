import { Shield, Crown, Sparkles, CheckCircle2 } from "lucide-react";

interface Props {
  roleName: string;
  roleColor: string;
  isSuperAdmin: boolean;
  permissions: string[];
  roleDescription?: string;
}

export function SettingsClearanceTab({
  roleName, roleColor, isSuperAdmin, permissions, roleDescription
}: Props) {
  return (
    <>
      <div className="form-section-header">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <Shield className="w-4 h-4 text-emerald-500" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-wide" style={{ fontFamily: "var(--font-cinzel), serif" }}>Active Security Clearance</h3>
          <p className="text-[11px] text-gray-400">Role-based access controls and permissions assigned to your account</p>
        </div>
      </div>
      <div className="form-section-body space-y-6">
        <div className="p-5 rounded-2xl border flex items-start gap-4" style={{ backgroundColor: `${roleColor}10`, borderColor: `${roleColor}30` }}>
          <div className="p-3 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${roleColor}25`, color: roleColor }}>
            {isSuperAdmin ? <Crown className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-gray-900">{roleName}</h4>
              {isSuperAdmin && <span className="text-[10px] font-bold uppercase tracking-wider bg-[#1a1512] text-[#c99335] px-2 py-0.5 rounded-full">Full Root Clearance</span>}
            </div>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              {roleDescription || (isSuperAdmin ? "Unrestricted administrative clearance across all treasury, community, content, and system configuration modules." : "Standard administrative privileges assigned by the Executive Committee.")}
            </p>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Granted Module Permissions ({isSuperAdmin ? "All (*)" : permissions.length})</h5>
          {isSuperAdmin ? (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-900 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c99335] flex-shrink-0" />
              <span>As a Super Administrator, you automatically possess wildcard clearance across every section, API endpoint, and capability.</span>
            </div>
          ) : permissions.length === 0 ? (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs italic">No specific module permissions assigned. Contact your Super Administrator.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {permissions.map((p) => (
                <div key={p} className="p-2.5 px-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
