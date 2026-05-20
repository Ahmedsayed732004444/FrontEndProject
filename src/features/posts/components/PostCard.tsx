import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Heart, Pencil, Trash2, MoreHorizontal, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAddLike, useDeleteLike } from "@/features/posts/hooks/usePosts";
import type { Post } from "@/features/posts/types/post";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LikesListModal } from "./LikesListModal";
import { CommentList } from "@/features/comments/components/CommentList";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
  onEdit?: () => void;
}

export function PostCard({ post, onDelete, onEdit }: PostCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount);
  const [localIsLiked, setLocalIsLiked] = useState(post.isLikedByMe);
  const [isHovered, setIsHovered] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const addLikeMutation = useAddLike();
  const deleteLikeMutation = useDeleteLike();

  const isAuthor = user?.id === post.author.userId;

  const handleAuthorClick = () => {
    navigate(`/profile/${post.author.userId}`);
  };

  const handleLikesClick = () => {
    setIsLikesModalOpen(true);
  };

  const handleLikeToggle = () => {
    if (localIsLiked) {
      setLocalLikesCount((prev) => prev - 1);
      setLocalIsLiked(false);
      deleteLikeMutation.mutate(post.id, {
        onSuccess: (data) => {
          setLocalLikesCount(data.likesCount);
          setLocalIsLiked(false);
        },
        onError: () => {
          // Revert optimistic update
          setLocalLikesCount((prev) => prev + 1);
          setLocalIsLiked(true);
        }
      });
    } else {
      setLocalLikesCount((prev) => prev + 1);
      setLocalIsLiked(true);
      addLikeMutation.mutate(post.id, {
        onSuccess: (data) => {
          setLocalLikesCount(data.likesCount);
          setLocalIsLiked(true);
        },
        onError: () => {
           // Revert optimistic update
           setLocalLikesCount((prev) => prev - 1);
           setLocalIsLiked(false);
        }
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete?.();
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.author.fullName}`,
          text: post.content,
          url: postUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(postUrl);
        }
      }
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Post link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
  };

  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md border-border-subtle hover:border-border-strong bg-surface-0 hover:bg-surface-hover/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="relative group cursor-pointer"
              onClick={handleAuthorClick}
            >
              {post.author.profilePictureUrl ? (
                <img
                  src={post.author.profilePictureUrl}
                  alt={post.author.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-surface-2 border border-border-subtle flex items-center justify-center text-foreground font-semibold shadow-sm group-hover:ring-2 group-hover:ring-primary/20 transition-all duration-300">
                  {getInitials(post.author.fullName)}
                </div>
              )}
              {/* Optional: Online status indicator */}
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-surface-0 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span
                className="font-semibold text-foreground text-[15px] hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1.5"
                onClick={handleAuthorClick}
              >
                {post.author.fullName}
                {isAuthor && <span className="badge-neutral text-[10px] px-1.5 py-0">You</span>}
              </span>
              {post.author.city && (
                <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[200px] sm:max-w-[400px]">
                   {post.author.city}
                </span>
              )}
              <div className="flex items-center text-[11px] text-muted mt-1 font-medium gap-1.5">
                <span>{formatRelativeTime(post.createdAt)}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                <span className="flex items-center gap-1">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                   Anyone
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
             {(isAuthor && (onEdit || onDelete)) && (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className={`h-8 w-8 rounded-full transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}
                   >
                     <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                     <span className="sr-only">Post options</span>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-40 p-1">
                   {onEdit && (
                     <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer rounded-md">
                       <Pencil className="h-4 w-4 text-muted-foreground" />
                       <span>Edit post</span>
                     </DropdownMenuItem>
                   )}
                   {onDelete && (
                     <DropdownMenuItem onClick={handleDelete} className="gap-2 cursor-pointer text-destructive focus:text-destructive rounded-md">
                       <Trash2 className="h-4 w-4" />
                       <span>Delete post</span>
                     </DropdownMenuItem>
                   )}
                 </DropdownMenuContent>
               </DropdownMenu>
             )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-2">
        <div className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap font-normal">
           {/* Simple mention/hashtag highlighting could go here */}
           {post.content.split('\n').map((line, i) => (
             <p key={i} className="mb-2 last:mb-0">
               {line.split(/(\s+)/).map((word, j) => {
                 if (word.startsWith('@') || word.startsWith('#')) {
                   return <span key={j} className="text-primary hover:underline cursor-pointer">{word}</span>;
                 }
                 return word;
               })}
             </p>
           ))}
        </div>
        
        {post.fileUrl && (
          <div className="mt-4 -mx-5 sm:mx-0 overflow-hidden sm:rounded-xl border-y sm:border border-border-subtle bg-surface-1">
            <img
              src={post.fileUrl}
              alt="Post attachment"
              className="w-full h-auto object-cover max-h-[500px] transition-transform duration-700 hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        )}
        
        {/* Engagement Stats - Like LinkedIn */}
        {localLikesCount > 0 && (
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground border-b border-border-subtle pb-3">
             <div className="flex items-center">
               <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center mr-1.5 ring-2 ring-surface-0">
                 <Heart className="h-2.5 w-2.5 fill-primary text-primary" />
               </div>
               <span
                 className="hover:text-primary hover:underline cursor-pointer transition-colors"
                 onClick={handleLikesClick}
               >
                  {localLikesCount} {localLikesCount === 1 ? 'like' : 'likes'}
               </span>
             </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-2 py-1 flex items-center justify-between border-t border-border-subtle/50 mx-3 mb-2 mt-1">
        <div className="flex items-center gap-1 w-full pt-1 overflow-x-auto no-scrollbar sm:overflow-visible">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeToggle}
            disabled={addLikeMutation.isPending || deleteLikeMutation.isPending}
            className={`flex-1 min-w-fit h-10 rounded-md font-medium text-[12px] sm:text-[13px] gap-1 sm:gap-2 transition-all px-2 ${
              localIsLiked 
                ? "text-primary bg-primary/5 hover:bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all duration-300 ${
                localIsLiked ? "fill-primary text-primary scale-110" : "scale-100"
              }`}
            />
            <span>Like</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={`flex-1 min-w-fit h-10 rounded-md font-medium text-[12px] sm:text-[13px] gap-1 sm:gap-2 transition-all px-2 ${
              showComments
                ? "text-primary bg-primary/5 hover:bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Comment</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex-1 min-w-fit h-10 rounded-md font-medium text-[12px] sm:text-[13px] text-muted-foreground hover:text-foreground hover:bg-surface-2 gap-1 sm:gap-2 px-2"
          >
            <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>

      {showComments && (
        <div className="px-5 pb-5 border-t border-border-subtle/50 pt-4">
          <CommentList postId={post.id} currentUserId={user?.id} />
        </div>
      )}

      <LikesListModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        postId={post.id}
      />
    </Card>
  );
}
