import { apiClient } from "@/lib/api/client";
import type { JobMatch } from "../types/ai";

export const aiService = {
  /**
   * GET /UserProfile/has-resumes
   * Check if current user has a CV uploaded
   */
  async checkHasResume(): Promise<boolean> {
    const response = await apiClient.get<boolean>("/UserProfile/has-resumes");
    return response;
  },

  /**
   * POST /Resume/update/analayse
   * Upload CV and get AI analysis
   */
  async analyseCV(cvFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("CvFile", cvFile);
    
    const response = await apiClient.post("/Resume/update/analayse", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds timeout
    });
    return response as string;
  },

  /**
   * GET /Match
   * Get job matches based on user's CV/skills
   */
  async getJobMatches(): Promise<JobMatch[]> {
    const response = await apiClient.get<JobMatch[]>("/Match", {
      timeout: 60000, // 60 seconds timeout
    });
    return response;
  },
};
