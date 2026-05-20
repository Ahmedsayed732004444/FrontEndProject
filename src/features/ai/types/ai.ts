export interface JobMatch {
  job_id: string;
  job_title: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
}

export interface CvAnalysisResult {
  rawText: string;
}
