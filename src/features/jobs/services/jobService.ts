import { apiClient } from "@/lib/api/client";
import type {
  JobsListResponse,
  JobsQueryParams,
  JobResponse,
  ApplyJobRequest,
  AddJobRequest,
  ApplicantsListResponse,
  ApiResult,
} from "../types/jobs";
import type {
  InterviewQuestion,
  SubmitInterviewRequest,
  InterviewResult,
} from "@/features/interview/types/interview";

/**
 * Jobs Service
 * Handles all Jobs endpoints
 */
class JobService {
  /**
   * Get all jobs with filters
   * GET /Jobs
   */
  async getAllJobs(params?: JobsQueryParams, signal?: AbortSignal): Promise<JobsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const response = await apiClient.get<any>(`/jobs?${queryString}`, { signal });
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Get job by id
   * GET /api/jobs/{id}
   */
  async getJobById(id: string): Promise<JobResponse> {
    const response = await apiClient.get<ApiResult<JobResponse>>(`/jobs/${id}`);
    return response.value;
  }

  /**
   * Apply to a job
   * POST /api/jobs/{jobId}/apply
   */
  async applyToJob(jobId: string, request: ApplyJobRequest): Promise<void> {
    const formData = new FormData();
    formData.append("CV", request.cv);
    formData.append("Phone", request.phone);
    if (request.notes) formData.append("Notes", request.notes);
    
    await apiClient.post(`/jobs/${jobId}/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Add new job
   * POST /api/jobs
   */
  async addJob(request: AddJobRequest): Promise<JobResponse> {
    const response = await apiClient.post<JobResponse>(`/jobs`, request);
    return response;
  }

  /**
   * Update job
   * PUT /api/jobs/{jobId}
   */
  async updateJob(jobId: string, request: AddJobRequest): Promise<void> {
    await apiClient.put(`/jobs/${jobId}`, request);
  }

  /**
   * Delete job
   * DELETE /api/jobs/{jobId}
   */
  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/jobs/${jobId}`);
  }

  /**
   * Toggle job active/inactive status
   * PUT /api/jobs/{jobId}/toggle-status
   */
  async toggleJobStatus(jobId: string): Promise<void> {
    await apiClient.put(`/jobs/${jobId}/toggle-status`);
  }

  /**
   * Get job applicants
   * GET /api/jobs/{jobId}/applicants
   */
  async getJobApplicants(jobId: string, params?: JobsQueryParams, signal?: AbortSignal): Promise<ApplicantsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params?.sortDirection) queryParams.append("SortDirection", params.sortDirection);
    
    const url = queryParams.toString()
      ? `/jobs/${jobId}/applicants?${queryParams.toString()}`
      : `/jobs/${jobId}/applicants`;

    const response = await apiClient.get<any>(url, { signal });
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Get jobs by company id
   * GET /api/jobs/company/{companyId}
   */
  async getJobsByCompany(companyId: string, params?: JobsQueryParams, signal?: AbortSignal): Promise<JobsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.searchValue) queryParams.append("SearchValue", params.searchValue);
    if (params?.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params?.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    
    const url = queryParams.toString()
      ? `/jobs/company/${companyId}?${queryParams.toString()}`
      : `/jobs/company/${companyId}`;

    const response = await apiClient.get<any>(url, { signal });
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Generate AI interview questions
   * POST /api/jobs/{jobId}/generate-questions
   */
  async generateQuestions(jobId: string): Promise<void> {
    await apiClient.post(`/jobs/${jobId}/generate-questions`);
  }

  /**
   * Get interview questions
   * GET /api/Interview/{jobId}/questions
   */
  async getInterviewQuestions(jobId: string): Promise<InterviewQuestion[]> {
    const response = await apiClient.get<InterviewQuestion[]>(`/interview/${jobId}/questions`);
    return response;
  }

  /**
   * Submit interview answers
   * POST /api/interview/{jobId}/submit
   */
  async submitInterview(jobId: string, request: SubmitInterviewRequest): Promise<InterviewResult> {
    const response = await apiClient.post<InterviewResult>(`/interview/${jobId}/submit`, request);
    return response;
  }
}

export const jobService = new JobService();
