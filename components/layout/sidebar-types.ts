import { LucideIcon } from "lucide-react";

export interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  iconColor?: string;
  badge?: string;
  badgeColor?: string;
  permission?: string | string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
