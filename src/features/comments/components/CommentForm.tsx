import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAddComment } from "../hooks/useComments";
import type { AddCommentRequest } from "../types/comment";

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

export function CommentForm({ postId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const addComment = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const data: AddCommentRequest = { content: content.trim() };
    addComment.mutate(
      { postId, data },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] resize-none bg-surface-2 border-border-subtle focus-visible:ring-primary/20"
        disabled={addComment.isPending}
      />
      <Button
        type="submit"
        disabled={!content.trim() || addComment.isPending}
        className="self-end h-[80px] px-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
