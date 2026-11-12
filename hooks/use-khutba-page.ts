import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function useKhutbaPage() {
  const [khutbas, setKhutbas] = useState<any[]>([]), [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true), [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"khutbas" | "logs">("khutbas");
  const [showForm, setShowForm] = useState(false), [editingKhutba, setEditingKhutba] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kRes, lRes] = await Promise.all([
        api.get("/api/v1/khutba/?published_only=false"),
        api.get("/api/v1/khutba/logs/"),
      ]);
      setKhutbas(kRes.data.results || kRes.data);
      setLogs(lRes.data.results || lRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteKhutba = async (id: number) => {
    if (!confirm("Delete this Khutba entry?")) return;
    try {
      await api.delete(`/api/v1/khutba/${id}/`);
      toast.success("Khutba deleted.");
      fetchData();
    } catch { toast.error("Failed to delete khutba."); }
  };

  const notifyKhutba = async (id: number) => {
    if (!confirm("Send push notification to all devices for this Khutba?")) return;
    try {
      const res = await api.post(`/api/v1/khutba/${id}/notify/`);
      toast.success(res.data.status === "No devices registered" ? "No devices registered." : `Notification sent to ${res.data.success_count || 0} devices.`);
      fetchData();
    } catch { toast.error("Failed to send notification."); }
  };

  return { khutbas, logs, loading, isSubmitting, setIsSubmitting, activeTab, setActiveTab, showForm, setShowForm, editingKhutba, setEditingKhutba, fetchData, deleteKhutba, notifyKhutba };
}
