import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "@/features/profile/services/profileService";
import { extractErrorMessage } from "@/lib/api/errors";
import { authService } from "@/features/auth/services/authService";
import type {
  BasicInfoRequest,
} from "@/features/profile/types/profile";

/**
 * Hook for getting user profile
 */
export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => profileService.getUserProfile(),
    enabled: authService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting specific user profile by ID
 */
export const useGetUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => profileService.getUserProfileById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for getting profile picture
 */
export const useGetProfilePicture = () => {
  return useQuery({
    queryKey: ["userProfile", "picture"],
    queryFn: () => profileService.getProfilePicture(),
    enabled: authService.isAuthenticated(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for updating basic info
 */
export const useUpdateBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BasicInfoRequest) => profileService.updateBasicInfo(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for updating profile picture
 */
export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.updateProfilePicture(file),
    onSuccess: () => {
      toast.success("Profile picture updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for updating cover picture
 */
export const useUpdateCoverPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.updateCoverPicture(file),
    onSuccess: () => {
      toast.success("Cover picture updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for updating CV
 */
export const useUpdateCv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.updateCv(file),
    onSuccess: () => {
      toast.success("CV updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting profile picture
 */
export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.deleteProfilePicture(),
    onSuccess: () => {
      toast.success("Profile picture deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting cover picture
 */
export const useDeleteCoverPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.deleteCoverPicture(),
    onSuccess: () => {
      toast.success("Cover picture deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting CV
 */
export const useDeleteCv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.deleteCv(),
    onSuccess: () => {
      toast.success("CV deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};
