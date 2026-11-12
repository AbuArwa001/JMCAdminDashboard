import { useState, useEffect, useCallback } from "react";
import { requestAdminFCMPermission } from "@/lib/fcm";

const SIDEBAR_COLLAPSED_KEY = "jmc_sidebar_collapsed";

export function useLayoutSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (saved !== null) setIsCollapsed(saved === "true");
    } catch {}
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    requestAdminFCMPermission().catch(console.error);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth >= 1024) toggleCollapse();
    else setIsMobileOpen((prev) => !prev);
  }, [toggleCollapse]);

  return { isMobileOpen, isCollapsed, toggleSidebar, toggleCollapse, closeMobile: () => setIsMobileOpen(false) };
}

