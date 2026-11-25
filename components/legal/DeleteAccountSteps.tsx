import { Smartphone, Globe } from "lucide-react";

export function DeleteAccountSteps() {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      {/* In-app method */}
      <div className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006838] flex items-center justify-center">
          <Smartphone className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">Option 1: Inside the Mobile App</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          If you currently have the Jamia Mosque app installed on your device:
        </p>
        <ol className="list-decimal pl-5 text-xs text-gray-600 space-y-1">
          <li>Open the <strong>Jamia Mosque</strong> app and sign in.</li>
          <li>Tap on <strong>Profile</strong> in the bottom navigation bar.</li>
          <li>Navigate to <strong>Account Settings</strong>.</li>
          <li>Tap <strong>Delete Account</strong> and confirm your request.</li>
        </ol>
      </div>

      {/* Web method */}
      <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm space-y-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <Globe className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">Option 2: Online Request Form (Below)</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          If you have uninstalled the app or prefer to request deletion via the web:
        </p>
        <ol className="list-decimal pl-5 text-xs text-gray-600 space-y-1">
          <li>Complete the official request form below.</li>
          <li>Enter your registered email address and phone number.</li>
          <li>Our data administration team will verify and process your deletion within 14-30 business days.</li>
        </ol>
      </div>
    </div>
  );
}

