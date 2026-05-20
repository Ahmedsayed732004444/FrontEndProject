import { apiClient } from "@/lib/api/client";

/**
 * Minimal User Service (read-only)
 * Kept intentionally aligned with supported profile flow.
 */
export const userService = {
  async getMe(signal?: AbortSignal): Promise<any> {
    return apiClient.get<any>("/api/UserProfile", { signal });
  },

  async getUserById(id: string, signal?: AbortSignal): Promise<any> {
    return apiClient.get<any>(`/api/UserProfile/${id}`, { signal });
  },

  async getUsers(params?: Record<string, any>, signal?: AbortSignal): Promise<any[]> {
    const queryParams = new URLSearchParams();

    if (params?.Name) queryParams.append("Name", params.Name);

    if (Array.isArray(params?.Skills) && params.Skills.length > 0) {
      params.Skills.forEach((skill: string) => queryParams.append("Skills", skill));
    }

    // Optional pagination (if backend supports it)
    if (params?.page) queryParams.append("PageNumber", String(params.page));
    if (params?.pageSize) queryParams.append("PageSize", String(params.pageSize));

    const url = queryParams.toString()
      ? `/api/Users?${queryParams.toString()}`
      : "/api/Users";

    const response = await apiClient.get<any>(url, { signal });

    // Handle possible wrapped response shapes
    if (Array.isArray(response)) return response;
    if (response && typeof response === "object" && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  },
};

