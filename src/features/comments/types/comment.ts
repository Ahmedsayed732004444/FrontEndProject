// src/features/comments/types/comment.ts

export interface CommentAuthor {
  userId: string;
  fullName: string;
  profilePictureUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  author: CommentAuthor;
  replies?: Reply[];
  repliesCount?: number;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  author: CommentAuthor;
}

export interface PaginatedComments {
  items: Comment[];
  pageNumber: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedReplies {
  items: Reply[];
  pageNumber: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AddCommentRequest {
  content: string;
}

export interface AddReplyRequest {
  content: string;
}
