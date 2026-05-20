import { useState } from "react";
import { Plus, Search, Layers, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PostCard } from "@/features/posts/components/PostCard";
import { CreatePostModal } from "@/features/posts/components/CreatePostModal";
import { EditPostModal } from "@/features/posts/components/EditPostModal";
import { useGetPosts, useDeletePost } from "@/features/posts/hooks/usePosts";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { PostsQueryParams, Post } from "@/features/posts/types/post";

export default function PostsPage() {
  const { isAuthenticated } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [params, setParams] = useState<PostsQueryParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useGetPosts(params);
  const deletePostMutation = useDeletePost();

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setParams((prev) => ({
      ...prev,
      searchValue: value || undefined,
      pageNumber: 1,
    }));
  };

  const handleDelete = (postId: string) => {
    deletePostMutation.mutate(postId);
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({
      ...prev,
      pageNumber: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-surface-0 pb-12">
      {/* Hero / Header Section */}
      <div className="bg-surface-1 border-b border-border-subtle sticky top-0 z-10 pt-4 pb-4 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-opacity-80">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center justify-center sm:justify-start gap-2">
              <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              Community Feed
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Connect with professionals and share insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative group w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Search posts..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-surface-2 border-border-subtle focus-visible:ring-primary/20 hover:border-border-strong transition-all h-10 w-full rounded-xl"
              />
            </div>

            {isAuthenticated && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-primary text-primary-foreground h-10 px-6 rounded-xl w-full sm:w-auto font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>Create Post</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading feed...</p>
          </div>
        ) : error ? (
          <div className="app-card border-destructive/20 bg-destructive/5 p-8 text-center rounded-xl flex flex-col items-center">
            <div className="bg-destructive/10 p-3 rounded-full mb-4">
              <Layers className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-destructive mb-2">Failed to load posts</h3>
            <p className="text-sm text-muted-foreground">Please try refreshing the page or check your connection.</p>
          </div>
        ) : data?.items && data.items.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards">
              {data.items.map((post, i) => (
                <div
                  key={post.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="opacity-0 animate-in fade-in slide-in-from-bottom-4 fill-mode-forwards"
                >
                  <PostCard
                    post={post}
                    onEdit={() => setEditingPost(post)}
                    onDelete={() => handleDelete(post.id)}
                  />
                </div>
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="flex items-center justify-center pt-8 pb-4">
                <div className="inline-flex items-center p-1 bg-surface-1 border border-border-subtle rounded-full shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-surface-2 transition-colors disabled:opacity-50"
                    disabled={!data.hasPreviousPage}
                    onClick={() => handlePageChange(params.pageNumber! - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="px-4 text-sm font-medium text-foreground min-w-[100px] text-center">
                    Page <span className="text-primary">{data.pageNumber}</span> of {data.totalPages}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-surface-2 transition-colors disabled:opacity-50"
                    disabled={!data.hasNextPage}
                    onClick={() => handlePageChange(params.pageNumber! + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 app-card bg-surface-1/50 border-dashed border-2">
            <div className="bg-surface-2 p-4 rounded-full mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {searchValue
                ? "No posts found matching your search. Try different keywords."
                : "Be the first to share something with the community!"}
            </p>
            {isAuthenticated && !searchValue && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-full px-6">
                <Plus className="h-4 w-4 mr-2" />
                Start a Conversation
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingPost && (
        <EditPostModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          post={editingPost}
        />
      )}
    </div>
  );
}
