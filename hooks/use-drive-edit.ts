import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoryData } from "@/lib/data";
import { updateDonationDrive, getCategories, getDonationDriveById } from "@/lib/api_data";
import { toast } from "sonner";

export function useDriveEdit(id: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true), [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]), [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"MPESA" | "BANK">("MPESA");
  const [formData, setFormData] = useState({
    title: "", category: "", start_date: "", end_date: "", target_amount: 0,
    description: "", paybill_number: "", account_name: "", account_number: "", status: "Active",
  });

  useEffect(() => {
    Promise.all([getCategories(), getDonationDriveById(id)])
      .then(([cats, drive]) => {
        setCategories(cats);
        if (drive) {
          setFormData({
            title: drive.title, category: drive.category,
            start_date: drive.start_date ? new Date(drive.start_date).toISOString().split("T")[0] : "",
            end_date: drive.end_date ? new Date(drive.end_date).toISOString().split("T")[0] : "",
            target_amount: drive.target_amount, description: drive.description,
            paybill_number: drive.paybill_number, account_name: drive.account_name,
            account_number: "", status: drive.status,
          });
        }
      })
      .catch(() => { setError("Failed to load drive details"); toast.error("Failed to load drive details"); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDonationDrive(id, { ...formData, uploaded_images: selectedImages });
      toast.success("Donation Drive updated successfully!");
      router.push("/drives");
    } catch { toast.error("Failed to update drive."); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return { loading, error, categories, formData, paymentMethod, selectedImages, setSelectedImages, setPaymentMethod, handleChange, handleSubmit };
}
