import { useState, useEffect } from "react";
import { getMe, updateMe } from "@/lib/api_data";
import { toast } from "sonner";
import { executeEmailChange } from "@/lib/services/change-email";

export function useSettingsPage(staffUser: any) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isFetching, setIsFetching] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [formData, setFormData] = useState({ userId: "", name: "Admin User", email: "admin@jmc.org", phone: "+254 700 000000" });

  useEffect(() => {
    setIsFetching(true);
    getMe().then((u) => {
      const email = u.email || staffUser?.email || "admin@jmc.org";
      setInitialEmail(email);
      setFormData({ userId: u.id || "", name: u.full_name || staffUser?.full_name || "Admin User", email, phone: u.phone_number || staffUser?.phone_number || "+254 700 000000" });
    }).catch(() => {}).finally(() => setIsFetching(false));
  }, [staffUser]);

  const isEmailChanged = initialEmail !== "" && formData.email.trim().toLowerCase() !== initialEmail.trim().toLowerCase();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmailChanged) { setIsEmailModalOpen(true); return; }
    setIsSavingProfile(true);
    try {
      await updateMe({ full_name: formData.name, phone_number: formData.phone });
      toast.success("Profile details updated successfully!");
    } catch { toast.error("Failed to update profile settings."); } finally { setIsSavingProfile(false); }
  };

  const confirmEmailChange = async (password: string) => {
    const trimmed = formData.email.trim().toLowerCase();
    await executeEmailChange(trimmed, password, initialEmail, formData.name, formData.phone);
    setInitialEmail(trimmed);
    setFormData((p) => ({ ...p, email: trimmed }));
    setIsEmailModalOpen(false);
    toast.success(`Email updated to ${trimmed}!`);
  };

  return { activeTab, setActiveTab, isFetching, isSavingProfile, initialEmail, isEmailChanged, isEmailModalOpen, setIsEmailModalOpen, formData, setFormData, handleProfileSubmit, confirmEmailChange };
}

