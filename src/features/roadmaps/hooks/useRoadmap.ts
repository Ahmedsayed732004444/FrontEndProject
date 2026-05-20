import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roadmapService } from "@/features/roadmaps/services/roadmapService";
import { extractErrorMessage } from "@/lib/api/errors";
import type {
  RoadmapListItem,
  RoadmapQueryParams,
} from "@/features/roadmaps/types/roadmap";

export const useGetRoadmaps = (params?: RoadmapQueryParams) => {
  return useQuery({
    queryKey: ["roadmaps", params],
    queryFn: () => roadmapService.getRoadmaps(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useGetRoadmapById = (id: number) => {
  return useQuery({
    queryKey: ["roadmaps", id],
    queryFn: () => roadmapService.getRoadmapById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetSavedRoadmaps = (params?: RoadmapQueryParams) => {
  return useQuery({
    queryKey: ["roadmaps", "saved", params],
    queryFn: () => roadmapService.getSavedRoadmaps(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useToggleSaveRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roadmapService.toggleSaveRoadmap(id),
    onSuccess: (_, variables) => {
      // Invalidate all roadmap queries
      queryClient.invalidateQueries({ queryKey: ["roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps", "saved"] });
      queryClient.invalidateQueries({ queryKey: ["roadmaps", variables] });
      
      // Show appropriate success message
      const currentData = queryClient.getQueryData(["roadmaps", variables]) as 
        { data: { items: RoadmapListItem[] } } | undefined;
      const roadmap = currentData?.data?.items?.find(r => r.id === variables);
      
      if (roadmap) {
        toast.success(
          roadmap.isSaved 
            ? "Roadmap unsaved successfully!" 
            : "Roadmap saved successfully!"
        );
      }
    },
    onError: (error) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
};
