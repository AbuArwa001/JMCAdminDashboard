"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);

    // Close sidebar by default on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
            } else {
                setIsMobileMenuOpen(true);
            }
        };
        
        // Initial check
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-secondary/30 flex">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={clsx("flex-1 flex flex-col transition-all duration-300 min-h-screen", isMobileMenuOpen ? "lg:ml-64" : "")}>
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
