import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useSendMessage } from "../hooks/useChat";

interface MessageInputProps {
  receiverId: string;
  onMessageSent?: () => void;
}

export function MessageInput({ receiverId, onMessageSent }: MessageInputProps) {
  const [content, setContent] = useState("");
  const sendMessage = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    sendMessage.mutate(
      { receiverId, content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          onMessageSent?.();
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-surface-0 border-t border-border-subtle mt-auto">
      <div className="flex items-end gap-2 bg-surface-1 rounded-3xl border border-border-subtle focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all p-1.5 pl-4 shadow-sm">
        <Textarea
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[44px] max-h-[120px] py-3 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none w-full scrollbar-thin"
          disabled={sendMessage.isPending}
          rows={1}
        />
        <Button
          type="submit"
          disabled={!content.trim() || sendMessage.isPending}
          size="icon"
          className="h-11 w-11 rounded-full shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          <Send className="h-[18px] w-[18px] ml-0.5" />
        </Button>
      </div>
    </form>
  );
}
