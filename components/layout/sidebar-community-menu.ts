import { BookOpen, Quote, Mic, Newspaper, CalendarDays, HandHeart, BookMarked, Clock, Calculator } from "lucide-react";
import { MenuSection } from "./sidebar-types";

export const COMMUNITY_SECTIONS: MenuSection[] = [
  {
    title: "Community & Content",
    items: [
      { name: "Darsas & Classes", href: "/community/darsas", icon: BookOpen, iconColor: "text-teal-400", permission: "darsas.manage" },
      { name: "Inspiration Quote", href: "/community/inspiration", icon: Quote, iconColor: "text-pink-400", permission: "inspiration.manage" },
      { name: "Friday Khutba", href: "/community/khutba", icon: Mic, iconColor: "text-amber-400", permission: "khutba.manage" },
      { name: "Friday Bulletins", href: "/community/bulletins", icon: Newspaper, iconColor: "text-blue-400", permission: "bulletins.manage" },
      { name: "Events", href: "/community/events", icon: CalendarDays, iconColor: "text-sky-400", permission: "events.manage" },
      { name: "Duas", href: "/community/duas", icon: HandHeart, iconColor: "text-rose-400", permission: "duas.manage" },
      { name: "Quran", href: "/community/quran", icon: BookMarked, iconColor: "text-emerald-400", permission: "quran.manage" },
      { name: "Prayer Timings", href: "/community/prayer-times", icon: Clock, iconColor: "text-[#c99335]", permission: "prayer_times.manage" },
      { name: "Zakat Calculator", href: "/community/zakat", icon: Calculator, iconColor: "text-green-400", permission: "zakat.manage" },
    ],
  },
];
