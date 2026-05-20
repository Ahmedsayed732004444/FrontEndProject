import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { followService } from "../services/followService";
import type { PaginatedFollowList } from "../types/follow";

/**
 * Follow User Mutation
 */
export const useFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followingId: string) => followService.followUser(followingId),
    onMutate: async (followingId) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userProfile", followingId] });
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });

      // 2. Snapshot previous values
      const previousOtherProfile = queryClient.getQueryData(["userProfile", followingId]);
      const previousMyProfile = queryClient.getQueryData(["userProfile"]);

      // We'll also update lists broadly, so snapshot them
      const listPredicate = (query: any) => {
        const key = query.queryKey[0] as string;
        return ["followers", "following", "my-followers", "my-following", "users"].includes(key);
      };
      const previousLists = queryClient.getQueriesData({ predicate: listPredicate });

      // 3. Optimistically update other user's profile
      queryClient.setQueryData(["userProfile", followingId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFollowedByMe: true,
          followersCount: (old.followersCount || 0) + 1,
        };
      });

      // 4. Optimistically update my profile's following count
      queryClient.setQueryData(["userProfile"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          followingCount: (old.followingCount || 0) + 1,
        };
      });

      // 5. Optimistically update any lists containing this user
      queryClient.setQueriesData({ predicate: listPredicate }, (old: any) => {
        if (!old || !old.items) return old;
        return {
          ...old,
          items: old.items.map((item: any) =>
            item.userId === followingId || item.id === followingId
              ? { ...item, isFollowedByMe: true }
              : item
          ),
        };
      });

      return { previousOtherProfile, previousMyProfile, previousLists, followingId };
    },
    onSuccess: () => {
      toast.success("User followed successfully!");
    },
    onError: (error: any, followingId, context) => {
      // Rollback
      if (context?.previousOtherProfile) {
        queryClient.setQueryData(["userProfile", followingId], context.previousOtherProfile);
      }
      if (context?.previousMyProfile) {
        queryClient.setQueryData(["userProfile"], context.previousMyProfile);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const message = error?.response?.data?.errors?.[0] || "Failed to follow user";
      toast.error(message);
    },
    onSettled: (_, __, followingId) => {
      // Sync with server
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return ["followers", "following", "my-followers", "my-following", "users"].includes(key);
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", followingId] });
    },
  });
};

/**
 * Unfollow User Mutation
 */
export const useUnfollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followingId: string) => followService.unfollowUser(followingId),
    onMutate: async (followingId) => {
      // 1. Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userProfile", followingId] });
      await queryClient.cancelQueries({ queryKey: ["userProfile"] });

      // 2. Snapshot previous values
      const previousOtherProfile = queryClient.getQueryData(["userProfile", followingId]);
      const previousMyProfile = queryClient.getQueryData(["userProfile"]);

      const listPredicate = (query: any) => {
        const key = query.queryKey[0] as string;
        return ["followers", "following", "my-followers", "my-following", "users"].includes(key);
      };
      const previousLists = queryClient.getQueriesData({ predicate: listPredicate });

      // 3. Optimistically update other user's profile
      queryClient.setQueryData(["userProfile", followingId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isFollowedByMe: false,
          followersCount: Math.max(0, (old.followersCount || 0) - 1),
        };
      });

      // 4. Optimistically update my profile's following count
      queryClient.setQueryData(["userProfile"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          followingCount: Math.max(0, (old.followingCount || 0) - 1),
        };
      });

      // 5. Optimistically update any lists containing this user
      queryClient.setQueriesData({ predicate: listPredicate }, (old: any) => {
        if (!old || !old.items) return old;
        return {
          ...old,
          items: old.items.map((item: any) =>
            item.userId === followingId || item.id === followingId
              ? { ...item, isFollowedByMe: false }
              : item
          ),
        };
      });

      return { previousOtherProfile, previousMyProfile, previousLists, followingId };
    },
    onSuccess: () => {
      toast.success("User unfollowed successfully!");
    },
    onError: (error: any, followingId, context) => {
      // Rollback
      if (context?.previousOtherProfile) {
        queryClient.setQueryData(["userProfile", followingId], context.previousOtherProfile);
      }
      if (context?.previousMyProfile) {
        queryClient.setQueryData(["userProfile"], context.previousMyProfile);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const message = error?.response?.data?.errors?.[0] || "Failed to unfollow user";
      toast.error(message);
    },
    onSettled: (_, __, followingId) => {
      // Sync with server
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return ["followers", "following", "my-followers", "my-following", "users"].includes(key);
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", followingId] });
    },
  });
};

/**
 * Get Followers Query
 */
export const useGetFollowers = (
  userId: string,
  pageNumber: number = 1,
  pageSize: number = 10,
  searchValue?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["followers", userId, pageNumber, pageSize, searchValue],
    queryFn: ({ signal }) =>
      followService.getFollowers(userId, pageNumber, pageSize, searchValue, signal),
    enabled: !!userId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get Following Query
 */
export const useGetFollowing = (
  userId: string,
  pageNumber: number = 1,
  pageSize: number = 10,
  searchValue?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["following", userId, pageNumber, pageSize, searchValue],
    queryFn: ({ signal }) =>
      followService.getFollowing(userId, pageNumber, pageSize, searchValue, signal),
    enabled: !!userId && enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get My Followers Query (uses token to get logged-in user's followers)
 */
export const useGetMyFollowers = (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchValue?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["my-followers", pageNumber, pageSize, searchValue],
    queryFn: ({ signal }) =>
      followService.getMyFollowers(pageNumber, pageSize, searchValue, signal),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get My Following Query (uses token to get logged-in user's following)
 */
export const useGetMyFollowing = (
  pageNumber: number = 1,
  pageSize: number = 10,
  searchValue?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["my-following", pageNumber, pageSize, searchValue],
    queryFn: ({ signal }) =>
      followService.getMyFollowing(pageNumber, pageSize, searchValue, signal),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
