import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useZakatSettings() {
  const [rate, setRate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchNisab = async () => {
    try {
      const response = await api.get("/api/v1/zakat/nisab-rate/");
      setRate(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNisab(); }, []);

  const saveNisab = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);
    try {
      await api.patch("/api/v1/zakat/nisab-rate/", data);
      setMessage({ type: "success", text: "Nisab rates updated successfully." });
      fetchNisab();
    } catch {
      setMessage({ type: "error", text: "Failed to update Nisab rates." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { rate, loading, isSubmitting, message, saveNisab };
}

