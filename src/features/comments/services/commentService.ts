// src/features/comments/services/commentService.ts
import { apiClient } from "@/lib/api/client";
import type {
  Comment,
  Reply,
  PaginatedComments,
  PaginatedReplies,
  AddCommentRequest,
  AddReplyRequest,
} from "../types/comment";

class CommentService {
  /**
   * Get comments for a specific post
   */
  async getPostComments(
    postId: string,
    pageNumber = 1,
    pageSize = 10,
    searchValue?: string,
    signal?: AbortSignal
  ): Promise<PaginatedComments> {
    const params: Record<string, string | number> = {
      pageNumber,
      pageSize,
    };
    if (searchValue) {
      params.searchValue = searchValue;
    }
    return apiClient.get<PaginatedComments>(`/comments/${postId}`, {
      params,
      signal,
    });
  }

  /**
   * Get replies for a specific comment
   */
  async getCommentReplies(
    commentId: string,
    pageNumber = 1,
    pageSize = 10,
    searchValue?: string,
    signal?: AbortSignal
  ): Promise<PaginatedReplies> {
    const params: Record<string, string | number> = {
      pageNumber,
      pageSize,
    };
    if (searchValue) {
      params.searchValue = searchValue;
    }
    return apiClient.get<PaginatedReplies>(`/comments/${commentId}/replies`, {
      params,
      signal,
    });
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, data: AddCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/comments/${postId}`, data);
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    return apiClient.delete<void>(`/comments/${commentId}`);
  }

  /**
   * Add a reply to a comment
   */
  async addReply(commentId: string, data: AddReplyRequest): Promise<Reply> {
    return apiClient.post<Reply>(`/comments/${commentId}/replies`, data);
  }

  /**
   * Delete a reply
   */
  async deleteReply(replyId: string): Promise<void> {
    return apiClient.delete<void>(`/comments/replies/${replyId}`);
  }

  /**
   * Like a comment
   */
  async likeComment(commentId: string): Promise<void> {
    return apiClient.post<void>(`/comments/${commentId}/like`);
  }

  /**
   * Unlike a comment
   */
  async unlikeComment(commentId: string): Promise<void> {
    return apiClient.delete<void>(`/comments/${commentId}/like`);
  }

  /**
   * Like a reply
   */
  async likeReply(replyId: string): Promise<void> {
    return apiClient.post<void>(`/comments/replies/${replyId}/like`);
  }

  /**
   * Unlike a reply
   */
  async unlikeReply(replyId: string): Promise<void> {
    return apiClient.delete<void>(`/comments/replies/${replyId}/like`);
  }
}

export const commentService = new CommentService();
