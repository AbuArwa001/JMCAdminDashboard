import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getRemainingTokenSeconds, DEFAULT_WARNING_SECONDS } from "@/lib/token-utils";

export function useTokenCountdown() {
  const { user, logout, refreshToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalWarningTime, setTotalWarningTime] = useState<number>(DEFAULT_WARNING_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const check = useCallback(() => {
    if (!user) return setIsOpen(false);
    const remaining = getRemainingTokenSeconds();
    if (remaining <= 0) return logout("session_expired");
    if (remaining <= DEFAULT_WARNING_SECONDS) {
      setTimeLeft(remaining);
      setTotalWarningTime((prev) => (isOpen ? prev : Math.max(DEFAULT_WARNING_SECONDS, remaining)));
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user, isOpen, logout]);

  useEffect(() => {
    if (!user) return;
    check();
    const interval = setInterval(check, 3000);
    return () => clearInterval(interval);
  }, [user, check]);

  const handleExtend = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const token = await refreshToken();
      if (token) {
        setIsOpen(false);
        toast.success("Session successfully extended.");
      } else {
        logout("session_expired");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  return { isOpen, timeLeft, totalWarningTime, isRefreshing, handleExtend, handleLogout: () => logout(), isUrgent: timeLeft <= 20 };
}

