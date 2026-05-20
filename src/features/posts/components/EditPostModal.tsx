import { useState, useEffect } from "react";
import { PencilLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useUpdatePost } from "@/features/posts/hooks/usePosts";
import type { Post, UpdatePostRequest } from "@/features/posts/types/post";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState(post.content);

  const updatePostMutation = useUpdatePost();

  useEffect(() => {
    setContent(post.content);
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content === post.content) return;

    const request: UpdatePostRequest = {
      content: content.trim(),
    };

    updatePostMutation.mutate(
      { postId: post.id, request },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!updatePostMutation.isPending) {
      setContent(post.content);
      onClose();
    }
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "U";
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] w-[95vw] max-w-[95vw] p-0 overflow-hidden bg-surface-0 border-border-subtle shadow-xl gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border-subtle bg-surface-1/50 backdrop-blur-sm">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <PencilLine className="h-5 w-5 text-primary" />
            Edit Post
          </DialogTitle>
          <DialogDescription className="sr-only">
            Edit your existing post
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-5 flex-1 overflow-y-auto max-h-[60vh]">
            <div className="flex gap-3 mb-4">
              {false ? (
                <img
                  src={""}
                  alt={user ? `${user?.firstName} ${user?.lastName}` : "User"}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-surface-2 border border-border-subtle flex items-center justify-center text-foreground font-semibold">
                  {getInitials(user ? `${user?.firstName} ${user?.lastName}` : undefined)}
                </div>
              )}
              <div className="flex flex-col justify-center">
                 <span className="font-semibold text-sm">{user ? `${user?.firstName} ${user?.lastName}` : "You"}</span>
                 <span className="text-xs text-muted-foreground">Posting to Anyone</span>
              </div>
            </div>
            
            <Textarea
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] border-0 focus-visible:ring-0 p-0 text-[15px] resize-none bg-transparent placeholder:text-muted-foreground/70"
              disabled={updatePostMutation.isPending}
            />
            
             {post.fileUrl && (
              <div className="mt-4 relative group rounded-xl overflow-hidden border border-border-subtle opacity-70">
                <img
                  src={post.fileUrl}
                  alt="Original attachment"
                  className="w-full object-contain max-h-[200px] bg-surface-1"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white text-xs font-medium">
                  Image cannot be edited
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-border-subtle bg-surface-1/50 flex items-center justify-end mt-auto">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={updatePostMutation.isPending}
                className="hover:bg-surface-2 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updatePostMutation.isPending || 
                  !content.trim() || 
                  content === post.content
                }
                className="bg-primary text-primary-foreground font-medium px-6 shadow-sm active:scale-95 transition-all"
              >
                {updatePostMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
