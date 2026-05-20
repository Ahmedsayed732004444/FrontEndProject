import React, { memo } from "react";
import { Briefcase, Calendar, Building, Plus } from "lucide-react";

interface JobTrackerStatsProps {
  stats: {
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
}

export const JobTrackerStats: React.FC<JobTrackerStatsProps> = memo(({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">Applied</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{String(stats.applied).padStart(2, "0")}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Interviews</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{String(stats.interviews).padStart(2, "0")}</p>
      </div>
      <div className="bg-white border border-green-200 rounded-xl p-5 bg-green-50/40">
        <div className="flex items-center gap-2 mb-3">
          <Building className="w-4 h-4 text-green-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-green-500">Offers</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{String(stats.offers).padStart(2, "0")}</p>
      </div>
      <div className="bg-white border border-red-100 rounded-xl p-5 bg-red-50/30">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4 text-red-400 rotate-45" />
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400">Rejected</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{String(stats.rejected).padStart(2, "0")}</p>
      </div>
    </div>
  );
});

JobTrackerStats.displayName = "JobTrackerStats";
