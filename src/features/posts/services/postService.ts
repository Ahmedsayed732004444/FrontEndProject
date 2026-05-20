import { apiClient } from "@/lib/api/client";
import type {
  Post,
  AddPostRequest,
  UpdatePostRequest,
  PostsQueryParams,
  LikeUser,
  LikeResponse,
} from "../types/post";
import type { PaginatedResponse } from "@/shared/types/pagination";

/**
 * Posts Service
 * Handles all Posts and Likes endpoints
 */
class PostService {
  /**
   * Add a new post
   * POST /api/posts
   */
  async addPost(request: AddPostRequest): Promise<Post> {
    const formData = new FormData();
    formData.append("Content", request.content);
    if (request.file) {
      formData.append("File", request.file);
    }

    const response = await apiClient.post<Post>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }

  /**
   * Update a post's content
   * PUT /api/posts/{postId}
   */
  async updatePost(postId: string, request: UpdatePostRequest): Promise<void> {
    await apiClient.put(`/posts/${postId}`, request);
  }

  /**
   * Delete a post
   * DELETE /api/posts/{postId}
   */
  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/posts/${postId}`);
  }

  /**
   * Get a single post by ID
   * GET /api/posts/{postId}
   */
  async getPost(postId: string): Promise<Post> {
    return apiClient.get<Post>(`/posts/${postId}`);
  }

  /**
   * Get all posts (paginated)
   * GET /api/posts
   */
  async getPosts(params?: PostsQueryParams): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.sortColumn) queryParams.append("SortColumn", params.sortColumn);
    if (params?.sortDirection) queryParams.append("SortDirection", params.sortDirection);

    const queryString = queryParams.toString();
    const url = queryString ? `/posts?${queryString}` : "/posts";
    return apiClient.get<PaginatedResponse<Post>>(url);
  }

  /**
   * Get current authenticated user's posts (paginated)
   * GET /api/posts/user
   */
  async getUserPosts(params?: PostsQueryParams): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.sortColumn) queryParams.append("SortColumn", params.sortColumn);
    if (params?.sortDirection) queryParams.append("SortDirection", params.sortDirection);

    const queryString = queryParams.toString();
    const url = queryString ? `/posts/user?${queryString}` : "/posts/user";
    return apiClient.get<PaginatedResponse<Post>>(url);
  }

  /**
   * Get posts by a specific user ID (paginated)
   * GET /api/posts/user/{userId}
   */
  async getUserPostsById(userId: string, params?: PostsQueryParams): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.sortColumn) queryParams.append("SortColumn", params.sortColumn);
    if (params?.sortDirection) queryParams.append("SortDirection", params.sortDirection);

    const queryString = queryParams.toString();
    const url = queryString ? `/posts/user/${userId}?${queryString}` : `/posts/user/${userId}`;
    return apiClient.get<PaginatedResponse<Post>>(url);
  }

  /**
   * Like a post
   * POST /api/likes/{postId}
   */
  async addLike(postId: string): Promise<LikeResponse> {
    return apiClient.post<LikeResponse>(`/likes/${postId}`);
  }

  /**
   * Unlike a post
   * DELETE /api/likes/{postId}
   */
  async deleteLike(postId: string): Promise<LikeResponse> {
    return apiClient.delete<LikeResponse>(`/likes/${postId}`);
  }

  /**
   * Get list of users who liked a post
   * GET /api/likes/{postId}
   */
  async getLikes(postId: string): Promise<LikeUser[]> {
    return apiClient.get<LikeUser[]>(`/likes/${postId}`);
  }
}

export const postService = new PostService();
