import { OVERVIEW_AND_FINANCE_SECTIONS } from "./sidebar-overview-menu";
import { COMMUNITY_SECTIONS } from "./sidebar-community-menu";
import { ADMIN_SECTIONS } from "./sidebar-admin-menu";
import { MenuSection } from "./sidebar-types";

export const ALL_MENU_SECTIONS: MenuSection[] = [
  ...OVERVIEW_AND_FINANCE_SECTIONS,
  ...COMMUNITY_SECTIONS,
  ...ADMIN_SECTIONS,
];

export * from "./sidebar-types";
