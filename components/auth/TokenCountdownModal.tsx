"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  RotateCw,
  LogOut,
  AlertTriangle,
  Shield,
  Loader2,
} from "lucide-react";
import clsx from "clsx";

// Default warning duration before token expiration (in seconds)
// Can be customized via NEXT_PUBLIC_SESSION_WARNING_SECONDS (default 120s / 2 minutes)
const DEFAULT_WARNING_SECONDS = 120;

interface DecodedToken {
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export default function TokenCountdownModal() {
  const { user, logout, refreshToken } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalWarningTime, setTotalWarningTime] = useState<number>(DEFAULT_WARNING_SECONDS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);

  // References to keep timer IDs clean across renders
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const periodicCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Read configured warning threshold
  const getWarningThreshold = useCallback((): number => {
    const envVal = Number(process.env.NEXT_PUBLIC_SESSION_WARNING_SECONDS);
    return !isNaN(envVal) && envVal > 0 ? envVal : DEFAULT_WARNING_SECONDS;
  }, []);

  // Check current token expiration and trigger warnings or logout accordingly
  const checkTokenExpiration = useCallback(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    const token = Cookies.get("firebaseToken") || localStorage.getItem("firebaseToken");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded.exp) return;

      const expMs = decoded.exp * 1000;
      const nowMs = Date.now();
      const remainingMs = expMs - nowMs;
      const remainingSecs = Math.floor(remainingMs / 1000);
      const warningThreshold = getWarningThreshold();

      // Case 1: Token is already expired
      if (remainingSecs <= 0) {
        setIsOpen(false);
        setIsExpiring(true);
        logout("session_expired");
        return;
      }

      // Case 2: Token is nearing expiration (within warning threshold)
      if (remainingSecs <= warningThreshold) {
        setTimeLeft(remainingSecs);
        setTotalWarningTime((prev) => (isOpen ? prev : Math.max(warningThreshold, remainingSecs)));
        setIsOpen(true);
      } else {
        // Case 3: Token is still well within validity
        setIsOpen(false);

        // Clear existing warning timer
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }

        // Schedule next prompt precisely when warning threshold is reached
        const delayUntilWarning = remainingMs - warningThreshold * 1000;
        if (delayUntilWarning > 0 && delayUntilWarning < 2147483647) {
          warningTimerRef.current = setTimeout(() => {
            checkTokenExpiration();
          }, delayUntilWarning);
        }
      }
    } catch (error) {
      console.error("[TokenCountdownModal] Error decoding token:", error);
    }
  }, [user, getWarningThreshold, isOpen, logout]);

  // Initial mount & periodic check every 5 seconds
  useEffect(() => {
    if (!user) return;

    checkTokenExpiration();

    periodicCheckRef.current = setInterval(() => {
      checkTokenExpiration();
    }, 5000);

    return () => {
      if (periodicCheckRef.current) clearInterval(periodicCheckRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [user, checkTokenExpiration]);

  // Handle visibility changes (e.g. laptop lid opened or tab focused after idle)
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        checkTokenExpiration();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
    };
  }, [checkTokenExpiration]);

  // Synchronize across multiple browser tabs via storage events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "firebaseToken" || e.key === "session_refreshed_at") {
        if (!e.newValue) {
          // Token removed in another tab
          logout("session_expired");
        } else {
          // Token refreshed in another tab
          setIsOpen(false);
          setIsExpiring(false);
          checkTokenExpiration();
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [logout, checkTokenExpiration]);

  // Live 1-second countdown ticker when modal is open
  useEffect(() => {
    if (!isOpen || isRefreshing || isExpiring) return;

    const interval = setInterval(() => {
      const token = Cookies.get("firebaseToken") || localStorage.getItem("firebaseToken");
      if (!token) {
        setIsOpen(false);
        logout("session_expired");
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (!decoded.exp) return;

        const remaining = Math.max(0, Math.floor((decoded.exp * 1000 - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setIsExpiring(true);
          toast.error("Session expired. Logging out for security...");
          logout("session_expired");
        }
      } catch {
        // If decoding fails, decrement manually
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsExpiring(true);
            logout("session_expired");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRefreshing, isExpiring, logout]);

  // Developer testing hooks to test the countdown modal instantly
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__triggerSessionCountdown = (seconds = 30) => {
        console.log(`[Dev] Testing session countdown modal with ${seconds} seconds.`);
        setTimeLeft(seconds);
        setTotalWarningTime(seconds);
        setIsOpen(true);
      };

      const handleTestEvent = (e: any) => {
        const testSeconds = e?.detail?.seconds || 30;
        setTimeLeft(testSeconds);
        setTotalWarningTime(testSeconds);
        setIsOpen(true);
      };

      window.addEventListener("test-session-countdown", handleTestEvent);
      return () => {
        delete (window as any).__triggerSessionCountdown;
        window.removeEventListener("test-session-countdown", handleTestEvent);
      };
    }
  }, []);

  // User Action: Extend Session / Refresh Token
  const handleExtendSession = async () => {
    if (isRefreshing || isExpiring) return;
    setIsRefreshing(true);

    try {
      const newToken = await refreshToken();
      if (newToken) {
        setIsOpen(false);
        setIsExpiring(false);
        toast.success("Session successfully extended.");
        checkTokenExpiration();
      } else {
        toast.error("Unable to extend session. Please sign in again.");
        logout("session_expired");
      }
    } catch (error) {
      console.error("[TokenCountdownModal] Extend session failed:", error);
      toast.error("Failed to extend session. Redirecting to login...");
      logout("session_expired");
    } finally {
      setIsRefreshing(false);
    }
  };

  // User Action: Explicit Log Out
  const handleManualLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  // Time formatter: MM:SS
  const formatTime = (secs: number) => {
    const safeSecs = Math.max(0, secs);
    const minutes = Math.floor(safeSecs / 60);
    const seconds = safeSecs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Calculate percentage of remaining warning time
  const progressRatio = totalWarningTime > 0
    ? Math.max(0, Math.min(100, (timeLeft / totalWarningTime) * 100))
    : 0;

  const isUrgent = timeLeft <= 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1a1512]/85 backdrop-blur-md selection:bg-[#c99335]/20 selection:text-[#c99335]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-md bg-[#120e0c] border border-[#c99335]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c99335]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#006838]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Icon with Pulsing Effect */}
            <div className="relative mx-auto w-20 h-20 mb-5 flex items-center justify-center">
              <div
                className={clsx(
                  "absolute inset-0 rounded-full animate-ping opacity-25",
                  isUrgent ? "bg-rose-500" : "bg-[#c99335]"
                )}
              />
              <div
                className={clsx(
                  "relative w-20 h-20 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shadow-xl",
                  isUrgent
                    ? "bg-rose-950/60 border-rose-500/70 text-rose-400 shadow-rose-900/30"
                    : "bg-[#1a1512] border-[#c99335]/60 text-[#c99335] shadow-[#c99335]/25"
                )}
              >
                {isUrgent ? (
                  <AlertTriangle className="w-9 h-9 animate-bounce" />
                ) : (
                  <Clock className="w-9 h-9 animate-pulse" />
                )}
              </div>
            </div>

            {/* Modal Title */}
            <h3
              className="text-2xl font-bold text-white tracking-wide mb-2"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Session Expiring Soon
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-300 font-sans leading-relaxed px-2">
              Your security session is nearing expiration. To maintain access and protect administrative operations, please confirm you would like to stay signed in.
            </p>

            {/* Countdown Display Card */}
            <div
              className={clsx(
                "rounded-2xl p-5 my-6 border transition-all duration-300 flex flex-col items-center justify-center shadow-inner",
                isUrgent
                  ? "bg-rose-950/30 border-rose-500/50"
                  : "bg-[#161210] border-[#2d2520]"
              )}
            >
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c99335]" />
                Time Remaining Before Logout
              </span>

              <div
                className={clsx(
                  "text-5xl font-mono font-bold tracking-widest my-1 transition-all",
                  isUrgent
                    ? "text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse"
                    : "text-[#c99335] drop-shadow-[0_2px_12px_rgba(201,147,53,0.3)]"
                )}
              >
                {formatTime(timeLeft)}
              </div>

              {/* Progress Bar */}
              <div className="w-full mt-4 bg-[#1a1512] h-2 rounded-full overflow-hidden border border-[#2d2520]">
                <motion.div
                  className={clsx(
                    "h-full rounded-full transition-all duration-300",
                    isUrgent
                      ? "bg-gradient-to-r from-rose-500 to-red-600"
                      : timeLeft <= 60
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-[#006838] via-[#c99335] to-[#e39e3b]"
                  )}
                  style={{ width: `${progressRatio}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Extend Session / Stay Logged In */}
              <button
                type="button"
                onClick={handleExtendSession}
                disabled={isRefreshing || isExpiring}
                className="flex-1 btn-primary justify-center py-3.5 px-4 text-sm font-semibold rounded-xl shadow-lg shadow-[#006838]/25 hover:shadow-[#006838]/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extending Session...</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                    <span>Extend Session</span>
                  </>
                )}
              </button>

              {/* Log Out Now */}
              <button
                type="button"
                onClick={handleManualLogout}
                disabled={isRefreshing || isExpiring}
                className="sm:w-auto px-5 py-3.5 rounded-xl border border-[#2d2520] bg-[#161210] hover:bg-[#1f1a16] text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Security Badge Footer */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-5 pt-2 border-t border-[#2d2520]/60">
              <Shield className="w-3.5 h-3.5 text-[#c99335]" />
              <span>Jamia Mosque Committee Executive Portal Security</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
