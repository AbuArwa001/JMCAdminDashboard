import { UserX, AlertTriangle } from "lucide-react";

export function DeleteAccountHero() {
  return (
    <div className="text-center space-y-3 pb-8 border-b border-gray-200">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <span>Google Play User Data & Account Deletion Portal</span>
      </div>

      <h1
        className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
        style={{ fontFamily: "var(--font-cinzel), serif" }}
      >
        Request Account & Data Deletion
      </h1>

      <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        In accordance with Google Play Developer Policies and the Kenya Data Protection Act, users of the <strong>Jamia Mosque mobile application (&quot;Jamia Give&quot;)</strong> can request the permanent deletion of their account and associated personal data.
      </p>
    </div>
  );
}

