import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { useGetPostComments } from "../hooks/useComments";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loader2, LogIn } from "lucide-react";

interface CommentListProps {
  postId: string;
  currentUserId?: string;
}

export function CommentList({ postId, currentUserId }: CommentListProps) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useGetPostComments(postId, 1, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Only authenticated users can post comments */}
      {isAuthenticated ? (
        <CommentForm postId={postId} />
      ) : (
        <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface-1 border border-border-subtle">
          <LogIn className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <a href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>{" "}
            to leave a comment
          </p>
        </div>
      )}

      {data?.items && data.items.length > 0 ? (
        <div className="space-y-3">
          {data.items.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
