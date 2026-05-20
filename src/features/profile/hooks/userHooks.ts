import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/types/api";
import { userService } from "@/features/profile/services/userService";

/**
 * Minimal User Hooks (read-only)
 * Social Links and other non-supported editing are disabled.
 */
export const useMe = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.auth.user, "me"],
    queryFn: () => userService.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * GET /api/Users/{id}
 */
export const useUser = (id: string | undefined) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * GET /api/Users
 * List/search users with filters
 */
export const useUsersList = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["users", "list", filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

