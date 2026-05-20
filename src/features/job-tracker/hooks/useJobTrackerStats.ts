import { useMemo } from "react";
import { ApplicationStatus } from "@/features/job-tracker/types/jobTracker";
import type { JobApplicationResponse } from "@/features/job-tracker/types/jobTracker";

export const useJobTrackerStats = (applications: JobApplicationResponse[] | undefined) => {
  return useMemo(() => {
    if (!applications) return { applied: 0, interviews: 0, offers: 0, rejected: 0 };
    
    return applications.reduce(
      (acc, app) => {
        switch (app.status) {
          case ApplicationStatus.Applied:
            return { ...acc, applied: acc.applied + 1 };
          case ApplicationStatus.InterviewScheduled:
            return { ...acc, interviews: acc.interviews + 1 };
          case ApplicationStatus.OfferReceived:
            return { ...acc, offers: acc.offers + 1 };
          case ApplicationStatus.Rejected:
            return { ...acc, rejected: acc.rejected + 1 };
          default:
            return acc;
        }
      },
      { applied: 0, interviews: 0, offers: 0, rejected: 0 }
    );
  }, [applications]);
};
