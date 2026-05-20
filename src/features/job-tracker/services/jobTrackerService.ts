import { apiClient } from "@/lib/api/client";
import type {
  JobApplicationsListResponse,
  JobTrackerQueryParams,
  JobApplicationRequest,
  JobApplicationResponse,
} from "../types/jobTracker";


/**
 * Job Tracker Service
 * Handles all Job Tracker endpoints
 */
class JobTrackerService {
  /**
   * Get all job applications for current user
   * GET /JobTracker
   */
  async getJobApplications(params?: JobTrackerQueryParams, signal?: AbortSignal): Promise<JobApplicationsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const response = await apiClient.get<any>(`/JobTracker?${queryString}`, { signal });
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Get single job application by id
   * GET /JobTracker/{id}
   */
  async getJobApplication(id: string): Promise<JobApplicationResponse> {
    const response = await apiClient.get<any>(`/JobTracker/${id}`);
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Add new job application
   * POST /JobTracker
   */
  async addJobApplication(request: JobApplicationRequest): Promise<JobApplicationResponse> {
    const response = await apiClient.post<JobApplicationResponse>("/JobTracker", request);
    return response;
  }

  /**
   * Update job application
   * PUT /JobTracker/{id}
   */
  async updateJobApplication(id: string, request: JobApplicationRequest): Promise<void> {
    await apiClient.put(`/JobTracker/${id}`, request);
  }

  /**
   * Delete job application
   * DELETE /JobTracker/{id}
   */
  async deleteJobApplication(id: string): Promise<void> {
    await apiClient.delete(`/JobTracker/${id}`);
  }
}

export const jobTrackerService = new JobTrackerService();
