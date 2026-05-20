import { apiClient } from "@/lib/api/client";
import type {
  UserProfileResponse,
  BasicInfoRequest,
} from "../types/profile";


/**
 * Profile Service
 * Handles all UserProfile endpoints
 */
class ProfileService {
  /**
   * Get user profile (paths are relative to `env.API_BASE_URL`, which already includes `/api`).
   */
  async getUserProfile(): Promise<UserProfileResponse> {
    const response = await apiClient.get<any>("/UserProfile");
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Get specific user profile by ID
   */
  async getUserProfileById(userId: string): Promise<UserProfileResponse> {
    const response = await apiClient.get<any>(`/UserProfile/${userId}`);
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Get profile picture URL
   */
  async getProfilePicture(): Promise<string> {
    const response = await apiClient.get<any>("/UserProfile/profile-picture");
    return response.value !== undefined ? response.value : response;
  }

  /**
   * Update basic info
   */
  async updateBasicInfo(data: BasicInfoRequest): Promise<void> {
    await apiClient.put("/UserProfile/basic-Info", data);
  }

  /**
   * Update profile picture
   */
  async updateProfilePicture(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("profilePicture", file);
    
    await apiClient.put("/UserProfile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Update cover picture
   */
  async updateCoverPicture(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("coverPicture", file);
    
    await apiClient.put("/UserProfile/cover-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Update CV file
   */
  async updateCv(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("cvFile", file);
    
    await apiClient.put("/UserProfile/cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(): Promise<void> {
    await apiClient.delete("/UserProfile/picture");
  }

  /**
   * Delete cover picture
   */
  async deleteCoverPicture(): Promise<void> {
    await apiClient.delete("/UserProfile/cover-picture");
  }

  /**
   * Delete CV file
   */
  async deleteCv(): Promise<void> {
    await apiClient.delete("/UserProfile/cv");
  }
}

// Export singleton instance
export const profileService = new ProfileService();
