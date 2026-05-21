import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import * as signalR from "@microsoft/signalr";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useGetConversation, useMarkAsRead } from "../hooks/useChat";
import { signalrService } from "../services/signalrService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Message } from "../types/chat";

interface ChatWindowProps {
  otherUserId: string;
  otherUserName?: string;
}

export function ChatWindow({ otherUserId, otherUserName }: ChatWindowProps) {
  const { user, token } = useAuth();
  const { data: messages, isLoading } = useGetConversation(otherUserId);
  const markAsRead = useMarkAsRead();
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [connState, setConnState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );

  // Extract user ID robustly (fallback to token if user.id is missing or named differently)
  const currentUserId = useMemo(() => {
    if (user?.id) return user.id;
    if (user && 'userId' in user) return (user as any).userId;
    if (!token) return undefined;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      return payload.sub || payload.nameid || payload.id;
    } catch (e) {
      return undefined;
    }
  }, [user, token]);

  // Connect to SignalR when component mounts
  useEffect(() => {
    signalrService.connect();

    return () => {
      signalrService.disconnect();
    };
  }, []);

  // Update connection state every second
  useEffect(() => {
    const interval = setInterval(() => {
      setConnState(signalrService.getConnectionState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mark messages as read when conversation loads
  useEffect(() => {
    if (messages && messages.length > 0) {
      const hasUnreadMessages = messages.some(
        (m) => !m.isRead && m.senderId === otherUserId
      );
      if (hasUnreadMessages) {
        markAsRead.mutate(otherUserId);
      }
    }
  }, [messages, otherUserId, markAsRead.mutate]);

  // Listen for incoming messages
  const handleReceiveMessage = useCallback((message: Message) => {
    setLocalMessages((prev) => {
      // Prevent duplicate messages
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  useEffect(() => {
    signalrService.onReceiveMessage(handleReceiveMessage);

    return () => {
      signalrService.offReceiveMessage(handleReceiveMessage);
    };
  }, [handleReceiveMessage]);

  // Update local messages when conversation loads
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  const allMessages = localMessages;

  return (
    <div className="flex flex-col h-full w-full bg-surface-0 relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle bg-surface-1/50 backdrop-blur-sm z-10 sticky top-0">
        <div className="flex items-center gap-3 pr-8"> {/* pr-8 to avoid overlap with close button */}
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-lg">
                {(otherUserName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <span 
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-0 ${
                connState === signalR.HubConnectionState.Connected ? "bg-green-500" : "bg-yellow-500 animate-pulse"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground text-base leading-none mb-1.5">{otherUserName || "Chat"}</h3>
            <p className="text-xs text-muted-foreground leading-none">
              {connState === signalR.HubConnectionState.Connected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={allMessages}
        currentUserId={currentUserId}
        isLoading={isLoading}
      />

      {/* Input */}
      <MessageInput
        receiverId={otherUserId}
        onMessageSent={() => {
          // Message will be received via SignalR
        }}
      />
    </div>
  );
}
