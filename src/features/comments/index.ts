// src/features/comments/index.ts

// Hooks
export * from "./hooks/useComments";

// Types
export * from "./types/comment";

// Service
export { commentService } from "./services/commentService";

// Components
export { CommentList } from "./components/CommentList";
export { CommentItem } from "./components/CommentItem";
export { CommentForm } from "./components/CommentForm";
export { ReplyList } from "./components/ReplyList";
export { ReplyItem } from "./components/ReplyItem";
export { ReplyForm } from "./components/ReplyForm";
