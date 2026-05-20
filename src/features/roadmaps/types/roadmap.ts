export interface RoadmapResource {
  type: string;
  url: string;
}

export interface RoadmapModule {
  week: number;
  title: string;
  description: string;
  skills_covered: string[];
  resources: RoadmapResource[];
  project: boolean;
}

export interface RoadmapData {
  roadmap_title: string;
  roadmap_type: string;
  duration_weeks: number;
  modules: RoadmapModule[];
  generation_failed: boolean;
}

export interface RoadmapListItem {
  id: number;
  createdAt: string;
  isSaved: boolean;
}

export interface RoadmapDetails {
  id: number;
  roadmapData: RoadmapData;
  createdAt: string;
  isSaved: boolean;
}

export interface RoadmapQueryParams {
  PageNumber?: number;
  PageSize?: number;
}
