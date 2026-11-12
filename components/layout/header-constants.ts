export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard Overview",
  "/drives": "Donation Drives",
  "/drives/create": "Create New Drive",
  "/categories": "Categories",
  "/categories/create": "New Category",
  "/donations": "Donations Log",
  "/accounts": "Donors & Accounts",
  "/transfers": "Internal Transfers",
  "/community/darsas": "Darsas & Classes",
  "/community/inspiration": "Inspiration Quote",
  "/community/khutba": "Friday Khutba",
  "/community/events": "Events",
  "/community/bulletins": "Friday Bulletins",
  "/community/duas": "Duas",
  "/community/quran": "Quran",
  "/community/prayer-times": "Prayer Timings",
  "/community/zakat": "Zakat Calculator",
  "/settings": "Portal Settings",
  "/settings/features": "Feature Toggles",
  "/users": "Staff & Access Control",
  "/roles": "Roles & Permissions Matrix",
};

export interface NotificationLog {
  id: number;
  title: string;
  body: string;
  image_url?: string | null;
  notification_type?: string | null;
  sent_at: string;
  recipient_count: number;
}
