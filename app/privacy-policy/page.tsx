import type { Metadata } from "next";
import { PublicHeader } from "@/components/legal/PublicHeader";
import { PublicFooter } from "@/components/legal/PublicFooter";
import { PrivacyHero } from "@/components/legal/PrivacyHero";
import { PrivacyContent } from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Jamia Mosque Mobile App & Services",
  description: "Official Privacy Policy and Data Protection declaration for Jamia Mosque (Jamia Give) mobile application.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <PublicHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PrivacyHero />
        <PrivacyContent />
      </main>
      <PublicFooter />
    </div>
  );
}

