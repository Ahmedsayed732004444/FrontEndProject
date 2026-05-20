import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { jobService } from "@/features/jobs/services/jobService";
import { extractErrorMessage } from "@/lib/api/errors";
import type {
  JobsQueryParams,
  ApplyJobRequest,
  AddJobRequest,
} from "@/features/jobs/types/jobs";
import type {
  SubmitInterviewRequest,
} from "@/features/interview/types/interview";

/**
 * Hook for getting all jobs
 */
export const useGetAllJobs = (params?: JobsQueryParams) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: ({ signal }) => jobService.getAllJobs(params, signal),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting job by id
 */
export const useGetJobById = (id: string) => {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for applying to a job
 */
export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, request }: { jobId: string; request: ApplyJobRequest }) =>
      jobService.applyToJob(jobId, request),
    onSuccess: () => {
      toast.success("Applied successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};


/**
 * Hook for updating a job
 */
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, request }: { jobId: string; request: AddJobRequest }) =>
      jobService.updateJob(jobId, request),
    onSuccess: () => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for deleting a job
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for toggling job status
 */
export const useToggleJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) => jobService.toggleJobStatus(jobId),
    onSuccess: () => {
      toast.success("Job status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};


/**
 * Hook for getting job applicants
 */
export const useGetJobApplicants = (jobId: string, params?: JobsQueryParams) => {
  return useQuery({
    queryKey: ["jobApplicants", jobId, params],
    queryFn: ({ signal }) => jobService.getJobApplicants(jobId, params, signal),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


/**
 * Hook for adding a job
 */
export const useAddJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddJobRequest) =>
      jobService.addJob(request),
    onSuccess: () => {
      toast.success("Job added successfully!");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for generating interview questions
 */
export const useGenerateQuestions = () => {
  return useMutation({
    mutationFn: (jobId: string) => jobService.generateQuestions(jobId),
    onSuccess: () => {
      toast.success("Questions generated successfully!");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

/**
 * Hook for getting interview questions
 */
export const useGetInterviewQuestions = (jobId: string) => {
  return useQuery({
    queryKey: ["interview-questions", jobId],
    queryFn: () => jobService.getInterviewQuestions(jobId),
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for submitting interview
 */
export const useSubmitInterview = () => {
  return useMutation({
    mutationFn: ({ jobId, request }: { jobId: string; request: SubmitInterviewRequest }) =>
      jobService.submitInterview(jobId, request),
    onSuccess: () => {
      toast.success("Interview submitted!");
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};
