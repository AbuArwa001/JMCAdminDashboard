"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Heart, List, CreditCard, Settings, X, ArrowRightLeft } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/api_data";

const MENU_ITEMS = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Donation Drives", href: "/drives", icon: Heart },
    { name: "Categories", href: "/categories", icon: List },
    { name: "Donations", href: "/donations", icon: CreditCard },
    { name: "Transfers", href: "/transfers", icon: ArrowRightLeft },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [formData, setFormData] = useState({
        name: "Admin User",
        email: "admin@jmc.org",
        phone: "+254 700 000000",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getMe();
                setFormData({
                    name: userData.full_name || "Admin User",
                    email: userData.email || "admin@jmc.org",
                    phone: userData.phone || "+254 700 000000",
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                console.log("Fetched user data:", userData);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchUserData();
    }, []);

    const pathname = usePathname();

    return (
        <aside className={clsx(
            "fixed left-0 top-0 h-screen bg-secondary-dark text-white z-50 transition-transform duration-300 ease-in-out w-64 border-r border-gray-800 flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
            <div className="p-6 flex items-center justify-center border-b border-gray-800 relative">
                <div className="relative w-32 h-32">
                    <Image
                        src="/logo.png"
                        alt="JMC Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                                isActive
                                    ? "bg-primary text-white shadow-md"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary-bronze flex items-center justify-center text-sm font-bold">
                        A
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{formData.name}</p>
                        <p className="text-xs text-gray-500">{formData.email}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
