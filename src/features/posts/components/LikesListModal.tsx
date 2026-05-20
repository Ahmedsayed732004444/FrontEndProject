import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useGetLikes } from "@/features/posts/hooks/usePosts";
import type { LikeUser } from "@/features/posts/types/post";

interface LikesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export function LikesListModal({ isOpen, onClose, postId }: LikesListModalProps) {
  const navigate = useNavigate();
  const { data: likes, isLoading } = useGetLikes(postId);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] w-[95vw] max-w-[95vw]">
        <DialogHeader>
          <DialogTitle>Likes</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground text-sm">
              Loading likes...
            </div>
          ) : likes && likes.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {likes.map((like: LikeUser) => (
                <div
                  key={like.userProfileId}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors"
                  onClick={() => handleUserClick(like.userProfileId)}
                >
                  {like.profilePictureUrl ? (
                    <img
                      src={like.profilePictureUrl}
                      alt={like.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface-2 border border-border-subtle flex items-center justify-center text-foreground font-semibold">
                      {getInitials(like.fullName)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {like.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(like.likedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-8">
              No likes yet
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
