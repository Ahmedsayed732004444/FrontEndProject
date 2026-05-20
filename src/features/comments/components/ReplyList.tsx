import { ReplyItem } from "./ReplyItem";
import { useGetCommentReplies } from "../hooks/useComments";
import { Loader2 } from "lucide-react";

interface ReplyListProps {
  commentId: string;
  postId: string;
  currentUserId?: string;
  enabled?: boolean;
}

export function ReplyList({
  commentId,
  postId,
  currentUserId,
  enabled = true,
}: ReplyListProps) {
  const { data, isLoading } = useGetCommentReplies(commentId, 1, 10, enabled);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4 ml-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.items || data.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-2">
      {data.items.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
