import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postService } from "@/features/posts/services/postService";
import { extractErrorMessage } from "@/lib/api/errors";
import type {
  AddPostRequest,
  UpdatePostRequest,
  PostsQueryParams,
} from "@/features/posts/types/post";

/**
 * Hook for adding a post
 */
export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddPostRequest) => postService.addPost(request),
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for updating a post
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, request }: { postId: string; request: UpdatePostRequest }) =>
      postService.updatePost(postId, request),
    onSuccess: (_, variables) => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting a post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.deletePost(postId),
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for getting a single post
 */
export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => postService.getPost(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting all posts
 */
export const useGetPosts = (params?: PostsQueryParams) => {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postService.getPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting current user's posts
 */
export const useGetUserPosts = (params?: PostsQueryParams) => {
  return useQuery({
    queryKey: ["user-posts", params],
    queryFn: () => postService.getUserPosts(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting posts by a specific user ID
 */
export const useGetUserPostsById = (userId: string, params?: PostsQueryParams) => {
  return useQuery({
    queryKey: ["user-posts", userId, params],
    queryFn: () => postService.getUserPostsById(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for adding a like
 */
export const useAddLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.addLike(postId),
    onSuccess: (data) => {
      // Update cache optimistically or invalidate
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.postId] });
    },
    onError: (error) => {
      // Handle 400 "Already Liked" error gracefully
      const message = extractErrorMessage(error);
      if (!message.includes("AlreadyLiked") && !message.includes("already liked")) {
        toast.error(message);
      }
    },
  });
};

/**
 * Hook for deleting a like
 */
export const useDeleteLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postService.deleteLike(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", data.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for getting likes for a post
 */
export const useGetLikes = (postId: string) => {
  return useQuery({
    queryKey: ["likes", postId],
    queryFn: () => postService.getLikes(postId),
    enabled: !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
