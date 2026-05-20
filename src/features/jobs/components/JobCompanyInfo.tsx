import React from "react";
import { Building2, ExternalLink } from "lucide-react";
import type { CompanyDetails } from "@/features/jobs/types/jobs";

interface JobCompanyInfoProps {
  companyDetails?: CompanyDetails;
}

export const JobCompanyInfo: React.FC<JobCompanyInfoProps> = ({ companyDetails }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent/10 p-5">
      {/* Decorative blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {companyDetails?.profilePictureUrl ? (
            <img
              src={companyDetails.profilePictureUrl}
              alt={companyDetails.name ?? "Company"}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-border/60 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-md">
              <Building2 className="w-8 h-8 text-primary/60" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
            <span className="text-[8px] text-white font-black">✓</span>
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
            Hiring Company
          </p>
          <h3 className="text-xl font-extrabold text-foreground truncate">
            {companyDetails?.name ?? "Company Name"}
          </h3>
          <p className="text-xs text-muted-foreground/60 font-medium mt-0.5">
            ID: {companyDetails?.companyId ?? "N/A"}
          </p>
        </div>

        {/* Link hint */}
        <div className="shrink-0 hidden sm:flex items-center gap-1 text-xs text-muted-foreground/40 font-medium">
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
};
