import { useState } from "react";
import { Heart, MessageCircle, Trash2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useLikeComment, useUnlikeComment, useDeleteComment } from "../hooks/useComments";
import { ReplyForm } from "./ReplyForm";
import { ReplyList } from "./ReplyList";
import type { Comment } from "../types/comment";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUserId?: string;
}

export function CommentItem({ comment, postId, currentUserId }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  // Track whether the current user added a reply in this session.
  // This is needed because the GET /comments/{postId} endpoint may not
  // return repliesCount, making the toggle button invisible without this flag.
  const [localReplyAdded, setLocalReplyAdded] = useState(false);

  const likeComment = useLikeComment();
  const unlikeComment = useUnlikeComment();
  const deleteComment = useDeleteComment();

  const handleLike = () => {
    if (comment.isLiked) {
      unlikeComment.mutate({ commentId: comment.id, postId });
    } else {
      likeComment.mutate({ commentId: comment.id, postId });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment.mutate({ commentId: comment.id, postId });
    }
  };

  const handleReplySuccess = () => {
    setShowReplyInput(false);
    setLocalReplyAdded(true);
    setShowReplies(true); // Auto-expand replies so the user sees their new reply
  };

  const isOwnComment = comment.author.userId === currentUserId;



  const replyCount = comment.repliesCount ?? comment.replies?.length ?? 0;

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

  return (
    <div className="flex gap-3 p-4 bg-surface-1 rounded-lg">
      <div className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center overflow-hidden flex-shrink-0">
        {comment.author.profilePictureUrl ? (
          <img
            src={comment.author.profilePictureUrl}
            alt={comment.author.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-foreground">
                {comment.author.fullName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground break-words">{comment.content}</p>
          </div>

          {isOwnComment && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
              onClick={handleDelete}
              disabled={deleteComment.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-4 mt-3">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 gap-1.5 ${
              comment.isLiked ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={handleLike}
            disabled={likeComment.isPending || unlikeComment.isPending}
          >
            <Heart className={`h-4 w-4 ${comment.isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{comment.likesCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-1.5 text-muted-foreground"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Reply</span>
          </Button>
        </div>

        {/* Reply form */}
        {showReplyInput && (
          <div className="mt-3">
            <ReplyForm
              commentId={comment.id}
              postId={postId}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyInput(false)}
            />
          </div>
        )}

        {/* View/Hide replies toggle */}
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="text-xs text-muted-foreground hover:text-primary mt-2 font-medium transition-colors"
        >
          {showReplies
            ? "Hide replies"
            : replyCount > 0
              ? `Show ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`
              : "Show replies"}
        </button>

        {/* Reply list */}
        {showReplies && (
          <ReplyList
            commentId={comment.id}
            postId={postId}
            currentUserId={currentUserId}
            enabled={true}
          />
        )}
      </div>
    </div>
  );
}
