import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { aiService } from "@/features/ai/services/aiService";
import { extractErrorMessage } from "@/lib/api/errors";
import { authService } from "@/features/auth/services/authService";

export const useCheckHasResume = () => {
  return useQuery({
    queryKey: ["has-resume"],
    queryFn: () => aiService.checkHasResume(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: authService.isAuthenticated(),
  });
};

export const useAnalyseCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cvFile: File) => aiService.analyseCV(cvFile),
    onSuccess: () => {
      toast.success("CV analysed successfully!");
      queryClient.invalidateQueries({ queryKey: ["has-resume"] });
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useGetJobMatches = () => {
  return useQuery({
    queryKey: ["job-matches"],
    queryFn: () => aiService.getJobMatches(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: authService.isAuthenticated(), // Only run if authenticated
  });
};
