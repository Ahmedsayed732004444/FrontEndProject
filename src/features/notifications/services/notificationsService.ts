// src/features/notifications/services/notificationsService.ts
import { apiClient } from "@/lib/api/client";
import type {
  NotificationsListResponse,
  UnreadCountResponse,
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesRequest,
  GetNotificationsParams,
} from "../types/notifications";

/**
 * Notifications Service
 * Handles all Notifications API endpoints
 */
class NotificationsService {
  /**
   * Get notifications (paginated)
   * GET /api/notifications
   */
  async getNotifications(params?: GetNotificationsParams, signal?: AbortSignal): Promise<NotificationsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.unreadOnly !== undefined) queryParams.append("unreadOnly", params.unreadOnly.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/notifications?${queryString}` : "/notifications";

    const response = await apiClient.get<NotificationsListResponse>(url, { signal });
    return response;
  }

  /**
   * Get unread count
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(signal?: AbortSignal): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>("/notifications/unread-count", { signal });
    return response;
  }

  /**
   * Mark notification as read
   * PUT /api/notifications/{notificationId}/read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put("/notifications/read-all");
  }

  /**
   * Delete notification
   * DELETE /api/notifications/{notificationId}
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  /**
   * Get notification preferences
   * GET /api/notifications/preferences
   */
  async getPreferences(signal?: AbortSignal): Promise<NotificationPreferencesResponse> {
    const response = await apiClient.get<NotificationPreferencesResponse>("/notifications/preferences", { signal });
    return response;
  }

  /**
   * Update notification preferences
   * PUT /api/notifications/preferences
   */
  async updatePreferences(request: UpdateNotificationPreferencesRequest): Promise<void> {
    await apiClient.put("/notifications/preferences", request);
  }
}

export const notificationsService = new NotificationsService();
