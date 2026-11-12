import { useState, useEffect } from "react";
import { getTransactions, getCategories, getDonationDrives } from "@/lib/api_data";
import { Transaction } from "@/lib/data";
import { toast } from "sonner";

export function useDonationsPage() {
  const [donations, setDonations] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTransactions().catch(() => []),
      getCategories().catch(() => []),
      getDonationDrives().catch(() => []),
    ]).then(([txs, cats, drives]) => {
      const catMap = (cats || []).reduce((acc: any, c: any) => ({ ...acc, [c.id]: c.category_name }), {});
      const driveMap = (drives || []).reduce((acc: any, d: any) => ({ ...acc, [d.id]: d }), {});

      const mapped = (txs || []).map((t: any): Transaction => {
        const drive = t.donation && typeof t.donation === "object" ? t.donation : driveMap[t.donation_id || t.donation];
        const catId = drive?.category_id || drive?.category;
        const name = (catId && catMap[catId]) || drive?.categoryName || (typeof t.category === "string" ? t.category : "General");
        const rawName = t.user_name || t.user?.full_name;
        const donorName = (rawName && rawName.toLowerCase() !== "anonymous") ? rawName.trim() : (t.account_name && t.account_name !== drive?.title ? t.account_name.trim() : "Anonymous Donor");
        return { ...t, donation: drive || t.donation, category: name, user_name: donorName };
      });
      setDonations(mapped);
    }).catch(() => toast.error("Failed to load donations")).finally(() => setIsLoading(false));
  }, []);

  return { donations, setDonations, isLoading };
}

