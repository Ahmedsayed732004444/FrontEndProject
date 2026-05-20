import React from "react";
import {
  Briefcase, MapPin, DollarSign, Calendar,
  Clock, GraduationCap, CheckCircle2, FileText,
} from "lucide-react";
import type { JobResponse } from "@/features/jobs/types/jobs";

interface JobDetailsContentProps {
  job: JobResponse;
}

const EXPERIENCE_LABELS: Record<number, string> = {
  0: "Entry Level",
  1: "Junior (1–2 yrs)",
  2: "Mid-Level (3–5 yrs)",
  3: "Senior (5–8 yrs)",
  4: "Lead / Principal",
  5: "Executive",
};

function MetaChip({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl p-3.5 border transition-colors ${
      highlight
        ? "bg-emerald-500/8 border-emerald-500/20"
        : "bg-muted/40 border-border/50"
    }`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        highlight ? "bg-emerald-500/15" : "bg-background"
      }`}>
        <Icon className={`w-4 h-4 ${highlight ? "text-emerald-600 dark:text-emerald-400" : "text-primary/70"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{label}</p>
        <p className={`text-sm font-bold truncate ${highlight ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export const JobDetailsContent: React.FC<JobDetailsContentProps> = ({ job }) => {
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null;
  const salaryText = [
    job.salaryMin && `$${job.salaryMin.toLocaleString()}`,
    job.salaryMax && `$${job.salaryMax.toLocaleString()}`,
  ]
    .filter(Boolean)
    .join(" – ");

  return (
    <div className="space-y-8">

      {/* ── Meta Grid ── */}
      <div className="grid grid-cols-2 gap-3">
        {job.jobType && (
          <MetaChip icon={Briefcase} label="Job Type" value={job.jobType} />
        )}
        <MetaChip icon={MapPin} label="Location" value={job.location ?? "Remote / Flexible"} />
        {hasSalary && (
          <MetaChip icon={DollarSign} label="Salary Range" value={salaryText} highlight />
        )}
        <MetaChip
          icon={Calendar}
          label="Posted"
          value={new Date(job.postedDate).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        />
        {job.deadlineDate && (
          <MetaChip
            icon={Clock}
            label="Deadline"
            value={new Date(job.deadlineDate).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          />
        )}
        {job.experienceLevel !== null && job.experienceLevel !== undefined && (
          <MetaChip
            icon={GraduationCap}
            label="Experience"
            value={EXPERIENCE_LABELS[job.experienceLevel] ?? `Level ${job.experienceLevel}`}
          />
        )}
      </div>

      {/* ── Description ── */}
      {job.jobDescription && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary/70" />
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
              About the Role
            </h4>
          </div>
          <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {job.jobDescription}
            </p>
          </div>
        </div>
      )}

      {/* ── Requirements ── */}
      {job.jobRequirements && job.jobRequirements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary/70" />
            <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
              Requirements
            </h4>
          </div>
          <div className="space-y-2">
            {job.jobRequirements.map((req, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl px-4 py-3 bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-primary">{index + 1}</span>
                </div>
                <p className="text-sm text-foreground/80 font-medium leading-relaxed">{req}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
