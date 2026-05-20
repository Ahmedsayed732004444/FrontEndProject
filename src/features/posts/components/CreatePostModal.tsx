import { useState } from "react";
import { X, Image as ImageIcon, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAddPost } from "@/features/posts/hooks/usePosts";
import type { AddPostRequest } from "@/features/posts/types/post";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const addPostMutation = useAddPost();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !file) return;

    const request: AddPostRequest = {
      content: content.trim(),
      file: file || undefined,
    };

    addPostMutation.mutate(request, {
      onSuccess: () => {
        setContent("");
        setFile(null);
        setPreview(null);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (!addPostMutation.isPending) {
      setContent("");
      setFile(null);
      setPreview(null);
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
            <Sparkles className="h-5 w-5 text-primary" />
            Create Post
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new post to share with your network
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
              disabled={addPostMutation.isPending}
            />
            
            {preview && (
              <div className="mt-4 relative group rounded-xl overflow-hidden border border-border-subtle">
                <img
                  src={preview}
                  alt="Attachment preview"
                  className="w-full object-contain max-h-[300px] bg-surface-1"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                   <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="rounded-full shadow-lg"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    disabled={addPostMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Remove Image
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 border-t border-border-subtle bg-surface-1/50 flex items-center justify-between mt-auto">
            <div className="flex items-center">
               <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={addPostMutation.isPending}
                  className="hidden"
                />
                <label 
                  htmlFor="image-upload" 
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-2 cursor-pointer transition-colors text-muted-foreground hover:text-primary"
                  title="Add an image"
                >
                  <ImageIcon className="h-5 w-5" />
                </label>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={addPostMutation.isPending}
                className="hover:bg-surface-2 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addPostMutation.isPending || (!content.trim() && !file)}
                className="bg-primary text-primary-foreground font-medium px-6 shadow-sm active:scale-95 transition-all"
              >
                {addPostMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
