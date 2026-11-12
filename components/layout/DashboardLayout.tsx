"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useLayoutSidebar } from "@/hooks/use-layout-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, isCollapsed, toggleSidebar, toggleCollapse, closeMobile } = useLayoutSidebar();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden selection:bg-[#c99335]/20 selection:text-[#c99335]">
      <Sidebar isMobileOpen={isMobileOpen} isCollapsed={isCollapsed} onClose={closeMobile} onToggleCollapse={toggleCollapse} />
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile} className="fixed inset-0 bg-[#1a1512]/60 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>
      <div className={clsx("flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out", isCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <Header onMenuClick={toggleSidebar} isSidebarCollapsed={isCollapsed} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="max-w-7xl mx-auto w-full">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
