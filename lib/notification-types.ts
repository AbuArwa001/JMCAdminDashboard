import { NotificationLog } from "@/components/layout/header-constants";

export interface UserNotificationPreferences {
  donations: boolean;
  donationMinAmount: number;
  khutba: boolean;
  bulletins: boolean;
  drives: boolean;
  community: boolean;
  browserPush: boolean;
}

export interface UserNotificationState {
  readIds: number[];
  dismissedIds: number[];
  lastReadTimestamp: string | null;
}

export interface EnrichedNotificationLog extends NotificationLog {
  isRead: boolean;
}

export const DEFAULT_PREFS: UserNotificationPreferences = {
  donations: true,
  donationMinAmount: 10000,
  khutba: true,
  bulletins: true,
  drives: true,
  community: true,
  browserPush: true,
};

export const DEFAULT_STATE: UserNotificationState = {
  readIds: [],
  dismissedIds: [],
  lastReadTimestamp: null,
};
