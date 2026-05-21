import { apiClient } from "@/lib/api/client";
import type { Message } from "../types/chat";

class ChatService {
  /**
   * Get conversation with a specific user
   */
  async getConversation(
    otherUserId: string,
    signal?: AbortSignal
  ): Promise<Message[]> {
    return apiClient.get<Message[]>(`/chat/${otherUserId}`, { signal });
  }

  /**
   * Mark messages as read
   */
  async markAsRead(senderId: string): Promise<void> {
    return apiClient.put<void>(`/chat/${senderId}/read`);
  }
}

export const chatService = new ChatService();
