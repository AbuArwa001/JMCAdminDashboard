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

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(false);
            } else {
                setIsMobileMenuOpen(true);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 relative flex selection:bg-amber-500/20 selection:text-amber-700">
            {/* Ambient Background Decorative Gradients */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-slate-200/50 via-amber-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <div className={clsx("flex-1 flex flex-col transition-all duration-300 min-h-screen", isMobileMenuOpen ? "lg:ml-72" : "")}>
                <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

