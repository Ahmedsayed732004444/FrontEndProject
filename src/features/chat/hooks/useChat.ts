import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import { signalrService } from "../services/signalrService";
import type { Message } from "../types/chat";

export const CHAT_QUERY_KEYS = {
  conversation: (otherUserId: string) => ["chat", "conversation", otherUserId] as const,
};

/**
 * Get conversation with a specific user
 */
export const useGetConversation = (otherUserId: string, enabled = true) => {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.conversation(otherUserId),
    queryFn: () => chatService.getConversation(otherUserId),
    enabled: enabled && !!otherUserId,
    refetchInterval: 3000, // Poll every 3 seconds to update read receipts
  });
};

/**
 * Mark messages as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (senderId: string) => chatService.markAsRead(senderId),
    onSuccess: () => {
      // Invalidate conversations to update read status
      queryClient.invalidateQueries({ queryKey: ["chat"] });
    },
  });
};

/**
 * Send a message via SignalR
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: string; content: string }) => {
      await signalrService.sendMessage(receiverId, content);
    },
  });
};

/**
 * Connect to SignalR
 */
export const useSignalRConnection = () => {
  const connectMutation = useMutation({
    mutationFn: () => signalrService.connect(),
  });

  const disconnectMutation = useMutation({
    mutationFn: () => signalrService.disconnect(),
  });

  return {
    connect: connectMutation.mutate,
    disconnect: disconnectMutation.mutate,
    isConnecting: connectMutation.isPending,
    isDisconnecting: disconnectMutation.isPending,
    connectionState: signalrService.getConnectionState(),
  };
};
