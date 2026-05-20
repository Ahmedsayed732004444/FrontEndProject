import { apiClient } from "@/lib/api/client";
import type {
  PaginatedFollowList,
} from "../types/follow";

class FollowService {
  async followUser(followingId: string, signal?: AbortSignal): Promise<void> {
    await apiClient.post(`/follow/${followingId}`, undefined, { signal });
  }

  async unfollowUser(followingId: string, signal?: AbortSignal): Promise<void> {
    await apiClient.delete(`/follow/${followingId}`, { signal });
  }

  async getFollowers(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    searchValue?: string,
    signal?: AbortSignal
  ): Promise<PaginatedFollowList> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(searchValue && { searchValue }),
    });

    return await apiClient.get<PaginatedFollowList>(
      `/follow/${userId}/followers?${params}`,
      { signal }
    );
  }

  async getFollowing(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    searchValue?: string,
    signal?: AbortSignal
  ): Promise<PaginatedFollowList> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(searchValue && { searchValue }),
    });

    return await apiClient.get<PaginatedFollowList>(
      `/follow/${userId}/following?${params}`,
      { signal }
    );
  }

  async getMyFollowers(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchValue?: string,
    signal?: AbortSignal
  ): Promise<PaginatedFollowList> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(searchValue && { searchValue }),
    });

    return await apiClient.get<PaginatedFollowList>(
      `/follow/my/followers?${params}`,
      { signal }
    );
  }

  async getMyFollowing(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchValue?: string,
    signal?: AbortSignal
  ): Promise<PaginatedFollowList> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(searchValue && { searchValue }),
    });

    return await apiClient.get<PaginatedFollowList>(
      `/follow/my/following?${params}`,
      { signal }
    );
  }
}

export const followService = new FollowService();