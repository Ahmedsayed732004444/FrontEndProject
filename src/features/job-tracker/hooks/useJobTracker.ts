import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobTrackerService } from "@/features/job-tracker/services/jobTrackerService";
import { extractErrorMessage } from "@/lib/api/errors";
import type {
  JobTrackerQueryParams,
  JobApplicationRequest,
} from "@/features/job-tracker/types/jobTracker";

/**
 * Hook for getting all job applications
 */
export const useGetJobApplications = (params?: JobTrackerQueryParams) => {
  return useQuery({
    queryKey: ["job-tracker", params],
    queryFn: ({ signal }) => jobTrackerService.getJobApplications(params, signal),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting single job application
 */
export const useGetJobApplication = (id: string) => {
  return useQuery({
    queryKey: ["job-tracker", id],
    queryFn: () => jobTrackerService.getJobApplication(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
  });
};

/**
 * Hook for adding job application
 */
export const useAddJobApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: JobApplicationRequest) =>
      jobTrackerService.addJobApplication(request),
    onSuccess: () => {
      toast.success("Application added successfully!");
      queryClient.invalidateQueries({ queryKey: ["job-tracker"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for updating job application
 */
export const useUpdateJobApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: JobApplicationRequest }) =>
      jobTrackerService.updateJobApplication(id, request),
    onSuccess: () => {
      toast.success("Application updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["job-tracker"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting job application
 */
export const useDeleteJobApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobTrackerService.deleteJobApplication(id),
    onSuccess: () => {
      toast.success("Application deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["job-tracker"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};
