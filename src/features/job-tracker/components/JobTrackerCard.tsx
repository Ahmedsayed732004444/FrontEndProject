import React, { memo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { ApplicationStatus, ApplicationStatusLabels, ApplicationStatusColors } from "@/features/job-tracker/types/jobTracker";
import type { JobApplicationResponse } from "@/features/job-tracker/types/jobTracker";

interface JobTrackerCardProps {
  application: JobApplicationResponse;
  onEdit: (app: JobApplicationResponse) => void;
  onDelete: (app: JobApplicationResponse) => void;
}

const getStatusBadge = (status: ApplicationStatus) => {
  const label = ApplicationStatusLabels[status] ?? String(status);
  const color = ApplicationStatusColors[status] ?? "#6b7280";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
      style={{
        backgroundColor: color + "18",
        color,
        borderColor: color + "35",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
};

export const JobTrackerCard: React.FC<JobTrackerCardProps> = memo(({ application, onEdit, onDelete }) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onEdit(application)}
    >
      <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
        <span className="text-base font-bold text-gray-500">
          {(application.companyName ?? "?")[0].toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-tight">
          {application.jobTitle || "Untitled Position"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {application.companyName || "Unknown Company"}
          {application.applicationSource && (
            <> · <span>{application.applicationSource}</span></>
          )}
        </p>
        {application.notes && (
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{application.notes}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        {getStatusBadge(application.status)}
        {application.applicationDate && (
          <p className="text-xs text-gray-400 mt-1">
            Applied: {new Date(application.applicationDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
          </p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onEdit(application)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(application)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

JobTrackerCard.displayName = "JobTrackerCard";
