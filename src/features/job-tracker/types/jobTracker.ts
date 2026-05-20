import type { PaginatedResponse } from "@/shared/types/pagination";

export const ApplicationStatus = {
  Applied: 0,
  InterviewScheduled: 1,
  OfferReceived: 2,
  Rejected: 3,
  Withdrawn: 4,
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Applied]: "Applied",
  [ApplicationStatus.InterviewScheduled]: "Interview Scheduled",
  [ApplicationStatus.OfferReceived]: "Offer Received",
  [ApplicationStatus.Rejected]: "Rejected",
  [ApplicationStatus.Withdrawn]: "Withdrawn",
};

export const ApplicationStatusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Applied]: "#2563eb", // blue-600
  [ApplicationStatus.InterviewScheduled]: "#ca8a04", // yellow-600
  [ApplicationStatus.OfferReceived]: "#16a34a", // green-600
  [ApplicationStatus.Rejected]: "#dc2626", // red-600
  [ApplicationStatus.Withdrawn]: "#4b5563", // gray-600
};

export interface JobApplicationResponse {
  id: string;
  jobTitle: string | null;
  companyName: string | null;
  applicationDate: string | null;
  status: ApplicationStatus;
  applicationSource: string | null;
  notes: string | null;
}

export type JobApplicationsListResponse = PaginatedResponse<JobApplicationResponse>;

export interface JobApplicationRequest {
  jobTitle: string;
  companyName?: string | null;
  applicationDate?: string | null;
  status: ApplicationStatus;
  applicationSource?: string | null;
  notes?: string | null;
}

export interface JobTrackerQueryParams {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
}
