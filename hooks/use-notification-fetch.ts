"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { NotificationLog } from "@/components/layout/header-constants";

export function useNotificationFetch() {
  const [raw, setRaw] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/khutba/logs?limit=50");
      setRaw(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 45000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return { raw, loading, refresh: fetchLogs };
}

