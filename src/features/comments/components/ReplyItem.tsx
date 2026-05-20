import { Heart, Trash2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useLikeReply, useUnlikeReply, useDeleteReply } from "../hooks/useComments";
import type { Reply } from "../types/comment";

interface ReplyItemProps {
  reply: Reply;
  postId: string;
  currentUserId?: string;
}

export function ReplyItem({ reply, postId, currentUserId }: ReplyItemProps) {
  const likeReply = useLikeReply();
  const unlikeReply = useUnlikeReply();
  const deleteReply = useDeleteReply();

  const handleLike = () => {
    if (reply.isLiked) {
      unlikeReply.mutate({ replyId: reply.id, postId });
    } else {
      likeReply.mutate({ replyId: reply.id, postId });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this reply?")) {
      deleteReply.mutate({ replyId: reply.id, postId });
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const isOwnReply = reply.author.userId === currentUserId;

  return (
    <div className="flex gap-3 p-3 bg-surface-2 rounded-lg ml-12">
      <div className="h-8 w-8 rounded-full bg-surface-1 flex items-center justify-center overflow-hidden flex-shrink-0">
        {reply.author.profilePictureUrl ? (
          <img
            src={reply.author.profilePictureUrl}
            alt={reply.author.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-foreground">
                {reply.author.fullName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(reply.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground break-words">{reply.content}</p>
          </div>

          {isOwnReply && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
              onClick={handleDelete}
              disabled={deleteReply.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 px-2 gap-1.5 ${
              reply.isLiked ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={handleLike}
            disabled={likeReply.isPending || unlikeReply.isPending}
          >
            <Heart
              className={`h-3.5 w-3.5 ${reply.isLiked ? "fill-current" : ""}`}
            />
            <span className="text-xs">{reply.likesCount}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
