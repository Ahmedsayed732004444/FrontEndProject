import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAddReply } from "../hooks/useComments";
import type { AddReplyRequest } from "../types/comment";

interface ReplyFormProps {
  commentId: string;
  postId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReplyForm({ commentId, postId, onSuccess, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const addReply = useAddReply();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const data: AddReplyRequest = { content: content.trim() };
    addReply.mutate(
      { commentId, postId, data },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <Textarea
        placeholder="Write a reply..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[60px] resize-none bg-surface-2 border-border-subtle focus-visible:ring-primary/20 text-sm"
        disabled={addReply.isPending}
      />
      <div className="flex gap-2 self-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={addReply.isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || addReply.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
