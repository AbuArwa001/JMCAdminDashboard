import { useState, useEffect } from "react";
import { CategoryData, Donation, DonationDrive, Transaction } from "@/lib/data";
import { getCategoryById, getDonationDriveById, getTransactionsByDonationDrive } from "@/lib/api_data";

export function useDriveDetail(id: string) {
  const [drive, setDrive] = useState<DonationDrive | undefined>();
  const [loading, setLoading] = useState(true), [category, setCategory] = useState<CategoryData>();
  const [donations, setDonations] = useState<Transaction[]>([]);

  const fetchDrive = async () => {
    try { const d = await getDonationDriveById(id); setDrive(d); }
    catch { setDrive(undefined); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (id) { setLoading(true); fetchDrive(); } }, [id]);
  useEffect(() => {
    if (drive?.category) getCategoryById(drive.category).then((c) => setCategory(c || undefined)).catch(() => {});
  }, [drive]);
  useEffect(() => {
    if (id) getTransactionsByDonationDrive(id).then((d) => setDonations(d || [])).catch(() => setDonations([]));
  }, [id]);

  const driveDonations: Donation[] = (donations || []).map((d) => ({
    id: d.id,
    donorName: d.user?.full_name || d.user_name || d.account_name || "Anonymous",
    amount: d.amount,
    category: d.category || (category ? category.category_name : "General"),
    driveId: d.donation?.id || d.donation_id || id,
    status: d.payment_status === "Completed" ? "Completed" : "Pending",
    date: d.donated_at ? d.donated_at.toString() : (d.date || new Date().toISOString()),
    paymentMethod: d.payment_method === "M-Pesa" ? "M-Pesa" : "Cash",
  }));

  return { drive, loading, category, donations, setDonations, driveDonations, fetchDrive };
}
