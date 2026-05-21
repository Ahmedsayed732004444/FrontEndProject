// src/features/notifications/types/notifications.ts

/**
 * Notification Types
 */
export const NotificationType = {
  NewMessage: "NewMessage",
  JobApplicationStatusChanged: "JobApplicationStatusChanged",
  SecurityAlert: "SecurityAlert",
  NewJobPosted: "NewJobPosted",
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Notification Priority
 */
export const NotificationPriority = {
  High: "High",
  Normal: "Normal",
  Low: "Low",
} as const;

export type NotificationPriority = (typeof NotificationPriority)[keyof typeof NotificationPriority];

/**
 * Notification Response
 */
export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actorId: string;
  actorName: string;
  actorPhotoUrl: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

/**
 * Paginated Notifications Response
 */
export interface NotificationsListResponse {
  items: Notification[];
  totalCount: number;
  unreadCount: number;
  pageNumber: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Unread Count Response
 */
export interface UnreadCountResponse {
  count: number;
}

/**
 * Notification Preference
 */
export interface NotificationPreference {
  type: NotificationType;
  inAppEnabled: boolean;
  emailEnabled: boolean;
}

/**
 * Notification Preferences Response
 */
export interface NotificationPreferencesResponse {
  preferences: NotificationPreference[];
}

/**
 * Update Notification Preferences Request
 */
export interface UpdateNotificationPreferencesRequest {
  preferences: NotificationPreference[];
}

/**
 * Get Notifications Query Parameters
 */
export interface GetNotificationsParams {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}
