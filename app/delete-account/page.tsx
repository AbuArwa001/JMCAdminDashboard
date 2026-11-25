import type { Metadata } from "next";
import { PublicHeader } from "@/components/legal/PublicHeader";
import { PublicFooter } from "@/components/legal/PublicFooter";
import { DeleteAccountHero } from "@/components/legal/DeleteAccountHero";
import { DeleteAccountSteps } from "@/components/legal/DeleteAccountSteps";
import { DeleteAccountForm } from "@/components/legal/DeleteAccountForm";
import { DeleteAccountFaq } from "@/components/legal/DeleteAccountFaq";

export const metadata: Metadata = {
  title: "Account & Data Deletion | Jamia Mosque Mobile App",
  description: "Request the deletion of your Jamia Mosque account, credentials, and associated user data.",
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <PublicHeader />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DeleteAccountHero />
        <DeleteAccountSteps />
        <DeleteAccountForm />
        <DeleteAccountFaq />
      </main>
      <PublicFooter />
    </div>
  );
}

