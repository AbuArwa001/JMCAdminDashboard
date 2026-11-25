import { Shield, Lock, CreditCard, UserCheck, RefreshCw, Mail } from "lucide-react";

export function PrivacyContent() {
  return (
    <div className="space-y-10 text-sm text-gray-700 leading-relaxed pt-8">
      {/* 1. Introduction & Ownership */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#c99335]" />
          1. Introduction & Scope
        </h2>
        <p>
          The <strong>Jamia Mosque mobile application (&quot;Jamia Give&quot;)</strong> is owned and operated by the <strong>Jamia Mosque Committee (JMC)</strong>, an Islamic non-profit organisation based in Nairobi, Kenya. We respect your privacy and are committed to safeguarding personal data in accordance with the Kenya Data Protection Act (2019) and Google Play Developer Policies.
        </p>
      </section>

      {/* 2. Data We Collect */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#006838]" />
          2. Information We Collect
        </h2>
        <p>We only collect information necessary to provide and improve our services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account Information:</strong> Name, email address, and authentication credentials (when you register, log in with password, or sign in via Google/Apple OAuth).
          </li>
          <li>
            <strong>Donation & Transaction Records:</strong> When you contribute via M-Pesa or other payment channels, we record transaction identifiers (e.g., M-Pesa Receipt Number, phone number used for payment, amount, date/time, and selected campaign/cause). <em>Note: We never collect or store banking PINs or M-Pesa secret PINs.</em>
          </li>
          <li>
            <strong>App Diagnostics & Analytics:</strong> Crash logs and diagnostic data to diagnose bugs, improve app stability, and ensure seamless delivery of prayer notifications and digital bulletins.
          </li>
        </ul>
      </section>

      {/* 3. How We Use Data */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#c99335]" />
          3. How We Use Your Information
        </h2>
        <p>Your information is used strictly for legitimate purposes, including:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>Processing donation contributions, Zakat, and Sadaqah, and generating verifiable digital receipts.</li>
          <li>Providing accurate prayer times, adhan notices, Friday khutba archives, and community events.</li>
          <li>Authenticating your user profile and giving you access to your personal donation history.</li>
          <li>Sending essential transactional updates regarding your contributions.</li>
        </ul>
      </section>

      {/* 4. Security & Encryption */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#006838]" />
          4. Data Security & Encryption in Transit
        </h2>
        <p>
          We employ industry-standard technical measures to safeguard your information. All data transmitted between the mobile application, our servers, and payment gateways is encrypted in transit using <strong>Transport Layer Security (HTTPS/TLS)</strong>. Server data is stored in secured cloud databases protected by strict role-based access controls and tokenized authentication.
        </p>
      </section>

      {/* 5. Third-Party Services */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-[#c99335]" />
          5. Third-Party Service Providers
        </h2>
        <p>We work with trusted third-party service providers to power specific app functionalities:</p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Firebase Authentication & Cloud Infrastructure (Google LLC):</strong> For secure identity management and encrypted database storage.</li>
          <li><strong>Safaricom M-Pesa (Daraja API):</strong> For automated processing of mobile money donation payments within Kenya.</li>
          <li><strong>Google Play Services:</strong> For application distribution, crash reporting, and core Android services.</li>
        </ul>
      </section>

      {/* 6. Data Retention & Deletion */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#006838]" />
          6. Your Rights & Account Deletion
        </h2>
        <p>
          You have the right to access, rectify, or request deletion of your account and personal profile data at any time. You can initiate account deletion directly from the mobile app settings or via our dedicated web portal:
        </p>
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs space-y-1 text-amber-900">
          <p className="font-semibold">Account & Data Deletion Portal:</p>
          <p>
            Visit <a href="/delete-account" className="underline font-bold text-[#006838]">Account Deletion Request Page</a> to submit an account deletion request online.
          </p>
          <p className="text-[11px] text-amber-800 pt-1">
            *Please note that certain financial donation records are retained for the statutory period required by Kenyan law and auditing standards.
          </p>
        </div>
      </section>

      {/* 7. Contact Us */}
      <section className="space-y-3 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#c99335]" />
          7. Contact Information
        </h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-1 text-gray-700">
          <p className="font-semibold text-gray-900">Data Protection Officer — Jamia Mosque Committee</p>
          <p>Email: <a href="mailto:support@jamiamosque.co.ke" className="text-[#006838] underline">support@jamiamosque.co.ke</a> or <a href="mailto:info@jamiamosque.org" className="text-[#006838] underline">info@jamiamosque.org</a></p>
          <p>Physical Address: Jamia Mosque, Banda Street, P.O. Box 40629 - 00100, Nairobi, Kenya</p>
        </div>
      </section>
    </div>
  );
}

