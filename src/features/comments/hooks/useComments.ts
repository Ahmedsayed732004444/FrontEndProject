// src/features/comments/hooks/useComments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { commentService } from "../services/commentService";
import { extractErrorMessage } from "@/lib/api/errors";
import type {
  PaginatedComments,
  AddCommentRequest,
  AddReplyRequest,
} from "../types/comment";

// ─── Query Key Factories ─────────────────────────────────────────────────────
// Using a hierarchy so prefix-based invalidation works correctly:
//   ["comments", postId]                        → all comment queries for a post
//   ["comments", postId, "list", page, size]    → paginated comment list
//   ["comments", commentId, "replies", page, size] → paginated replies

export const COMMENT_QUERY_KEYS = {
  /** All queries for a post's comments (used for broad invalidation) */
  postCommentRoot: (postId: string) => ["comments", postId] as const,

  /** Specific page of comments for a post */
  postComments: (
    postId: string,
    pageNumber: number,
    pageSize: number,
    searchValue?: string
  ) => ["comments", postId, "list", pageNumber, pageSize, searchValue] as const,

  /** All replies for a comment */
  commentReplies: (
    commentId: string,
    pageNumber: number,
    pageSize: number
  ) => ["comments", commentId, "replies", pageNumber, pageSize] as const,
} as const;

// ─── Comments ────────────────────────────────────────────────────────────────

/**
 * Get comments for a specific post
 */
export const useGetPostComments = (
  postId: string,
  pageNumber = 1,
  pageSize = 10,
  searchValue?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.postComments(postId, pageNumber, pageSize, searchValue),
    queryFn: () => commentService.getPostComments(postId, pageNumber, pageSize, searchValue),
    enabled: enabled && !!postId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Get replies for a specific comment
 */
export const useGetCommentReplies = (
  commentId: string,
  pageNumber = 1,
  pageSize = 10,
  enabled = false
) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.commentReplies(commentId, pageNumber, pageSize),
    queryFn: () => commentService.getCommentReplies(commentId, pageNumber, pageSize),
    enabled: enabled && !!commentId,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Add a comment to a post
 */
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: AddCommentRequest }) =>
      commentService.addComment(postId, data),
    onSuccess: (newComment, variables) => {
      toast.success("Comment added successfully!");
      
      // Instantly update UI by prepending to all cached comment lists for this post
      queryClient.setQueriesData(
        { queryKey: ["comments", variables.postId, "list"] },
        (old: PaginatedComments | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: [newComment, ...old.items],
          };
        }
      );

      // Invalidate ALL comment queries for this post to ensure server state is in sync
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

/**
 * Delete a comment
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      commentService.deleteComment(commentId),
    onSuccess: (_, variables) => {
      toast.success("Comment deleted successfully!");
      // Invalidate ALL comment queries for this post (all pages)
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

/**
 * Add a reply to a comment
 */
export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: AddReplyRequest;
      postId: string;
    }) => commentService.addReply(commentId, data),
    onSuccess: (newReply, variables) => {
      toast.success("Reply added successfully!");
      
      // 1. Instantly append the reply to the comment's replies cache
      queryClient.setQueriesData(
        { queryKey: ["comments", variables.commentId, "replies"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            items: [...old.items, newReply],
          };
        }
      );

      // 2. Increment the repliesCount on the parent comment in the post's comments cache
      queryClient.setQueriesData(
        { queryKey: ["comments", variables.postId, "list"] },
        (old: PaginatedComments | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map(c => 
              c.id === variables.commentId 
                ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } 
                : c
            ),
          };
        }
      );

      // Invalidate all comment queries for this post (includes replies count)
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
      // Also invalidate the specific replies query for this comment
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.commentId, "replies"],
      });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

/**
 * Delete a reply
 */
export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId }: { replyId: string; postId: string }) =>
      commentService.deleteReply(replyId),
    onSuccess: (_, variables) => {
      toast.success("Reply deleted successfully!");
      // Invalidate all comment queries for this post
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
};

// ─── Likes (with optimistic updates) ─────────────────────────────────────────

/**
 * Like a comment — optimistic update on the currently loaded first page
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      commentService.likeComment(commentId),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId) });

      // Save previous state for rollback (get data from all matching list queries)
      const queryFilter = { queryKey: ["comments", variables.postId, "list"] };
      const previousQueries = queryClient.getQueriesData(queryFilter);

      // Optimistically update all matching pages in cache
      queryClient.setQueriesData(queryFilter, (old: PaginatedComments | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((c) =>
            c.id === variables.commentId
              ? { ...c, isLiked: true, likesCount: c.likesCount + 1 }
              : c
          ),
        };
      });

      return { previousQueries };
    },
    onError: (error, _, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(extractErrorMessage(error));
    },
    onSettled: (_, __, variables) => {
      // Invalidate all pages to sync server state
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
    },
  });
};

/**
 * Unlike a comment — optimistic update on the currently loaded first page
 */
export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string; postId: string }) =>
      commentService.unlikeComment(commentId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId) });

      const queryFilter = { queryKey: ["comments", variables.postId, "list"] };
      const previousQueries = queryClient.getQueriesData(queryFilter);

      queryClient.setQueriesData(queryFilter, (old: PaginatedComments | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((c) =>
            c.id === variables.commentId
              ? { ...c, isLiked: false, likesCount: Math.max(0, c.likesCount - 1) }
              : c
          ),
        };
      });

      return { previousQueries };
    },
    onError: (error, _, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(extractErrorMessage(error));
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
    },
  });
};

/**
 * Like a reply — optimistic update on the currently loaded first page
 */
export const useLikeReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId }: { replyId: string; postId: string }) =>
      commentService.likeReply(replyId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] });

      const listFilter = { queryKey: ["comments", variables.postId, "list"] };
      const repliesFilter = { 
        predicate: (query: any) => query.queryKey[0] === "comments" && query.queryKey[2] === "replies" 
      };
      
      const previousList = queryClient.getQueriesData(listFilter);
      const previousReplies = queryClient.getQueriesData(repliesFilter);

      // Update in the parent comments list (if replies are loaded there)
      queryClient.setQueriesData(listFilter, (old: PaginatedComments | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((comment) => {
            if (!comment.replies) return comment;
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === variables.replyId
                  ? { ...reply, isLiked: true, likesCount: reply.likesCount + 1 }
                  : reply
              ),
            };
          }),
        };
      });

      // Update in the specific reply lists
      queryClient.setQueriesData(repliesFilter, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((reply: any) => 
            reply.id === variables.replyId
              ? { ...reply, isLiked: true, likesCount: reply.likesCount + 1 }
              : reply
          )
        };
      });

      return { previousList, previousReplies };
    },
    onError: (error, _, context) => {
      if (context?.previousList) {
        context.previousList.forEach(([k, d]) => queryClient.setQueryData(k, d));
      }
      if (context?.previousReplies) {
        context.previousReplies.forEach(([k, d]) => queryClient.setQueryData(k, d));
      }
      toast.error(extractErrorMessage(error));
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
      queryClient.invalidateQueries({
        predicate: (query: any) => query.queryKey[0] === "comments" && query.queryKey[2] === "replies",
      });
    },
  });
};

/**
 * Unlike a reply — optimistic update on the currently loaded first page
 */
export const useUnlikeReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ replyId }: { replyId: string; postId: string }) =>
      commentService.unlikeReply(replyId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["comments", variables.postId] });

      const listFilter = { queryKey: ["comments", variables.postId, "list"] };
      const repliesFilter = { 
        predicate: (query: any) => query.queryKey[0] === "comments" && query.queryKey[2] === "replies" 
      };
      
      const previousList = queryClient.getQueriesData(listFilter);
      const previousReplies = queryClient.getQueriesData(repliesFilter);

      queryClient.setQueriesData(listFilter, (old: PaginatedComments | undefined) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((comment) => {
            if (!comment.replies) return comment;
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === variables.replyId
                  ? { ...reply, isLiked: false, likesCount: Math.max(0, reply.likesCount - 1) }
                  : reply
              ),
            };
          }),
        };
      });

      queryClient.setQueriesData(repliesFilter, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((reply: any) => 
            reply.id === variables.replyId
              ? { ...reply, isLiked: false, likesCount: Math.max(0, reply.likesCount - 1) }
              : reply
          )
        };
      });

      return { previousList, previousReplies };
    },
    onError: (error, _, context) => {
      if (context?.previousList) {
        context.previousList.forEach(([k, d]) => queryClient.setQueryData(k, d));
      }
      if (context?.previousReplies) {
        context.previousReplies.forEach(([k, d]) => queryClient.setQueryData(k, d));
      }
      toast.error(extractErrorMessage(error));
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: COMMENT_QUERY_KEYS.postCommentRoot(variables.postId),
      });
      queryClient.invalidateQueries({
        predicate: (query: any) => query.queryKey[0] === "comments" && query.queryKey[2] === "replies",
      });
    },
  });
};
