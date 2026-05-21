// src/features/notifications/context/NotificationsContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { notificationsService } from "../services/notificationsService";
import { notificationsSignalrService } from "../services/notificationsSignalrService";
import type { Notification, NotificationPreference, GetNotificationsParams } from "../types/notifications";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  preferences: NotificationPreference[];
  isConnected: boolean;
  fetchNotifications: (params?: GetNotificationsParams) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: NotificationPreference[]) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to SignalR on mount
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        await notificationsSignalrService.connect();
        if (mounted) {
          setIsConnected(true);
          console.log("Notifications SignalR connected");
        }
      } catch (err) {
        console.error("Failed to connect to notifications SignalR:", err);
        if (mounted) {
          setIsConnected(false);
        }
      }
    };

    connect();

    return () => {
      mounted = false;
      notificationsSignalrService.disconnect();
    };
  }, []);

  // Set up SignalR event listeners
  useEffect(() => {
    const handleReceiveNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleUnreadCountUpdated = (count: number) => {
      setUnreadCount(count);
    };

    notificationsSignalrService.onReceiveNotification(handleReceiveNotification);
    notificationsSignalrService.onUnreadCountUpdated(handleUnreadCountUpdated);

    return () => {
      notificationsSignalrService.offReceiveNotification(handleReceiveNotification);
      notificationsSignalrService.offUnreadCountUpdated(handleUnreadCountUpdated);
    };
  }, []);

  const fetchNotifications = useCallback(async (params?: GetNotificationsParams, signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsService.getNotifications(params, signal);
      setNotifications(response.items);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async (signal?: AbortSignal) => {
    setError(null);
    try {
      const response = await notificationsService.getUnreadCount(signal);
      setUnreadCount(response.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setError(null);
    try {
      await notificationsService.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark notification as read");
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setError(null);
    try {
      await notificationsService.markAllAsRead();
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          isRead: true,
          readAt: new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark all notifications as read");
      console.error("Failed to mark all notifications as read:", err);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setError(null);
    try {
      await notificationsService.deleteNotification(notificationId);
      // Update local state
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((notif) => notif.id !== notificationId);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete notification");
      console.error("Failed to delete notification:", err);
    }
  }, []);

  const fetchPreferences = useCallback(async (signal?: AbortSignal) => {
    setError(null);
    try {
      const response = await notificationsService.getPreferences(signal);
      setPreferences(response.preferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch preferences");
      console.error("Failed to fetch preferences:", err);
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences: NotificationPreference[]) => {
    setError(null);
    try {
      await notificationsService.updatePreferences({ preferences: newPreferences });
      setPreferences(newPreferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update preferences");
      console.error("Failed to update preferences:", err);
    }
  }, []);

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    preferences,
    isConnected,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchPreferences,
    updatePreferences,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
