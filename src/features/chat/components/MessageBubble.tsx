import { User } from "lucide-react";
import type { Message } from "../types/chat";

interface MessageBubbleProps {
  message: Message;
  currentUserId?: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isOwnMessage = message.senderId === currentUserId;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
      >
        {!isOwnMessage && (
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-auto">
            <span className="text-primary text-xs font-semibold">
              {(message.senderName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div
          className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
        >
          {!isOwnMessage && (
            <span className="text-[11px] font-medium text-muted-foreground mb-1 ml-1">
              {message.senderName}
            </span>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-sm ${
              isOwnMessage
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-surface-2 text-foreground rounded-bl-sm border border-border-subtle/50"
            }`}
          >
            <p className="text-sm break-words leading-relaxed">{message.content}</p>
          </div>
          <div className={`flex items-center gap-1.5 mt-1 ${isOwnMessage ? "mr-1" : "ml-1"}`}>
            <span className="text-[10px] text-muted-foreground/70 font-medium">
              {formatTime(message.sentAt)}
            </span>
            {isOwnMessage && (
              <span className={`text-[10px] font-bold ${message.isRead ? "text-primary" : "text-muted-foreground/50"}`}>
                {message.isRead ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
