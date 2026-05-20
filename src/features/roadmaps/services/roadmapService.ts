import { apiClient } from "@/lib/api/client";
import type {
  RoadmapListItem,
  RoadmapDetails,
  RoadmapQueryParams,
} from "../types/roadmap";
import type { PaginatedResponse } from "@/shared/types/pagination";

export const roadmapService = {
  /**
   * GET /Roadmap
   * Get all roadmaps with pagination
   */
  async getRoadmaps(params?: RoadmapQueryParams): Promise<PaginatedResponse<RoadmapListItem>> {
    const queryParams = new URLSearchParams();
    
    if (params?.PageNumber) queryParams.append("PageNumber", params.PageNumber.toString());
    if (params?.PageSize) queryParams.append("PageSize", params.PageSize.toString());
    
    const queryString = queryParams.toString();
    const response = await apiClient.get<PaginatedResponse<RoadmapListItem>>(
      `/Roadmap${queryString ? `?${queryString}` : ""}`
    );
    return response;
  },

  /**
   * GET /Roadmap/{id}
   * Get single roadmap by integer id
   */
  async getRoadmapById(id: number): Promise<RoadmapDetails> {
    const response = await apiClient.get<RoadmapDetails>(`/Roadmap/${id}`);
    return response;
  },

  /**
   * GET /Roadmap/saved
   * Get saved roadmaps for current user
   */
  async getSavedRoadmaps(params?: RoadmapQueryParams): Promise<PaginatedResponse<RoadmapListItem>> {
    const queryParams = new URLSearchParams();
    
    if (params?.PageNumber) queryParams.append("PageNumber", params.PageNumber.toString());
    if (params?.PageSize) queryParams.append("PageSize", params.PageSize.toString());
    
    const queryString = queryParams.toString();
    const response = await apiClient.get<PaginatedResponse<RoadmapListItem>>(
      `/Roadmap/saved${queryString ? `?${queryString}` : ""}`
    );
    return response;
  },

  /**
   * POST /Roadmap/{id}/toggle-status
   * Toggle save/unsave roadmap
   */
  async toggleSaveRoadmap(id: number): Promise<void> {
    await apiClient.post(`/Roadmap/${id}/toggle-status`);
  },
};
