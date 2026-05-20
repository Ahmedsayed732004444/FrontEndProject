// src/features/posts/index.ts

// Hooks
export * from "./hooks/usePosts";

// Types
export * from "./types/post";

// Service
export { postService } from "./services/postService";

// Components
export { PostCard } from "./components/PostCard";
export { CreatePostModal } from "./components/CreatePostModal";
export { EditPostModal } from "./components/EditPostModal";
export { LikesListModal } from "./components/LikesListModal";

// Pages
export { default as PostsPage } from "./pages/PostsPage";
export { default as MyPostsPage } from "./pages/MyPostsPage";
