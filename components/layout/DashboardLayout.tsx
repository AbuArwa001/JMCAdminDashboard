"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { requestAdminFCMPermission } from "@/lib/fcm";

const SIDEBAR_COLLAPSED_KEY = "jmc_sidebar_collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initialize collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  // Close mobile drawer if resized to desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Register admin browser for FCM push notifications
  useEffect(() => {
    requestAdminFCMPermission().catch(console.error);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
        } catch {}
        return next;
      });
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden selection:bg-[#c99335]/20 selection:text-[#c99335]">
      <Sidebar
        isMobileOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onClose={closeMobileSidebar}
        onToggleCollapse={toggleCollapse}
      />

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
            className="fixed inset-0 bg-[#1a1512]/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <Header onMenuClick={toggleSidebar} isSidebarCollapsed={isCollapsed} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
