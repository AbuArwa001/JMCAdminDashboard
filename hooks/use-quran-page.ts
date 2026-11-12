import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useQuranPage() {
  const [reciters, setReciters] = useState<any[]>([]), [audios, setAudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true), [activeTab, setActiveTab] = useState<"reciters" | "audio">("reciters");
  const [isSubmittingReciter, setIsSubmittingReciter] = useState(false), [isSubmittingAudio, setIsSubmittingAudio] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [r, a] = await Promise.all([api.get("/api/v1/quran/reciters/"), api.get("/api/v1/quran/audio/")]);
      setReciters(r.data.results || r.data);
      setAudios(a.data.results || a.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const deleteReciter = async (id: number) => {
    if (!confirm("Delete this reciter? All related audios will be deleted too.")) return;
    await api.delete(`/api/v1/quran/reciters/${id}/`);
    fetchData();
  };

  const deleteAudio = async (id: number) => {
    if (!confirm("Delete this audio entry?")) return;
    await api.delete(`/api/v1/quran/audio/${id}/`);
    fetchData();
  };

  return { reciters, audios, loading, activeTab, setActiveTab, isSubmittingReciter, setIsSubmittingReciter, isSubmittingAudio, setIsSubmittingAudio, fetchData, deleteReciter, deleteAudio };
}

