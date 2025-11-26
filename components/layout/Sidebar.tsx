"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Heart, PieChart, Wallet, Settings, Menu } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Donation Drives", href: "/drives", icon: Heart },
    { name: "Categories", href: "/categories", icon: PieChart },
    { name: "Donations", href: "/donations", icon: Wallet },
    { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 bg-secondary-dark text-white h-screen fixed left-0 top-0 border-r border-gray-800">
            <div className="p-6 flex items-center justify-center border-b border-gray-800">
                <h1 className="text-2xl font-bold text-primary">JMC Admin</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {NAV_ITEMS.map((item) => {
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
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-gray-500">admin@jmc.org</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
