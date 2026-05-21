// src/features/notifications/services/notificationsSignalrService.ts
import * as signalR from "@microsoft/signalr";
import type { Notification } from "../types/notifications";

class NotificationsSignalRService {
  private connection: signalR.HubConnection | null = null;
  private readonly hubUrl = import.meta.env.VITE_NOTIFICATIONS_HUB_URL as string;

  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => localStorage.getItem("auth_token") || "",
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log("Connected to Notifications Hub ✓");
    } catch (error) {
      console.error("Failed to connect to Notifications Hub:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("Disconnected from Notifications Hub");
      } catch (error) {
        console.error("Failed to disconnect from Notifications Hub:", error);
      }
      this.connection = null;
    }
  }

  onReceiveNotification(callback: (notification: Notification) => void): void {
    if (!this.connection) {
      console.warn("SignalR: Cannot register listener — not connected");
      return;
    }
    this.connection.on("ReceiveNotification", callback);
  }

  offReceiveNotification(callback: (notification: Notification) => void): void {
    if (!this.connection) return;
    this.connection.off("ReceiveNotification", callback);
  }

  onUnreadCountUpdated(callback: (count: number) => void): void {
    if (!this.connection) {
      console.warn("SignalR: Cannot register listener — not connected");
      return;
    }
    this.connection.on("UnreadCountUpdated", callback);
  }

  offUnreadCountUpdated(callback: (count: number) => void): void {
    if (!this.connection) return;
    this.connection.off("UnreadCountUpdated", callback);
  }

  getConnectionState(): signalR.HubConnectionState {
    return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
  }
}

export const notificationsSignalrService = new NotificationsSignalRService();