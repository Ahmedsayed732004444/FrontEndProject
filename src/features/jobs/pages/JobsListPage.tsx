import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useGetAllJobs } from "@/features/jobs/hooks/useJobs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  MapPin, Briefcase, Calendar, DollarSign, Search,
  ChevronLeft, ChevronRight,
  Clock, AlertCircle, Bookmark, CheckCircle,
  ChevronDown, Zap, Users, Star,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPostedLabel(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 60) return `Posted ${minutes}m ago`;
  if (hours < 24) return `Posted ${hours}h ago`;
  if (days === 1) return "Posted yesterday";
  return `Posted ${days} days ago`;
}

function isDeadlineSoon(dateStr: string | null) {
  if (!dateStr) return false;
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 5;
}

function getCompanyInitial(name: string | null | undefined) {
  return (name ?? "C").charAt(0).toUpperCase();
}

const LOGO_COLORS = [
  { bg: "#4F8EF7", text: "#fff" },
  { bg: "#34C17B", text: "#fff" },
  { bg: "#2D2D2D", text: "#fff" },
  { bg: "#F76B4F", text: "#fff" },
  { bg: "#A855F7", text: "#fff" },
  { bg: "#F59E0B", text: "#fff" },
  { bg: "#06B6D4", text: "#fff" },
];

function getLogoColor(name: string | null | undefined) {
  const key = (name ?? "").charCodeAt(0) % LOGO_COLORS.length;
  return LOGO_COLORS[key];
}

// Fake match % based on job index for visual demo (real AI match would come from API)
function getFakeMatch(idx: number) {
  const vals = [98, 91, 87, 94, 82, 79, 95, 88];
  return vals[idx % vals.length];
}

// ── Filter chips ──────────────────────────────────────────────────────────────

const FILTERS = [
  { label: "Remote", icon: <MapPin className="w-3 h-3" /> },
  { label: "Full-time", icon: <Clock className="w-3 h-3" /> },
  { label: "$150k+", icon: <DollarSign className="w-3 h-3" /> },
  { label: "Tech Stack", icon: <Briefcase className="w-3 h-3" /> },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

const JobCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
    <div className="flex items-start gap-4">
      <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-7 w-20 rounded-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex items-center gap-3 pt-1">
      <Skeleton className="h-9 w-28 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────

const JobsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const { data: jobsData, isLoading, error } = useGetAllJobs({
    searchValue: debouncedSearch,
    pageNumber,
    pageSize,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  };

  const handlePageChange = (newPage: number) => setPageNumber(newPage);
  const handleJobClick = (jobId: string) => navigate(`/jobs/${jobId}`);

  const toggleFilter = (label: string) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const toggleSave = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setSavedJobs((prev) => {
      const next = new Set(prev);
      next.has(jobId) ? next.delete(jobId) : next.add(jobId);
      return next;
    });
  };

  const totalResults = (jobsData?.totalPages ?? 0) * pageSize;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* ── Search & Filter Section ── */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 mb-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-none">
                Explore <span className="text-blue-600">Opportunities</span>
              </h1>
              <p className="text-lg text-gray-500 font-medium">Find your next career move with AI-powered matching.</p>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <Input
                  id="job-search"
                  placeholder="Search roles, skills, or companies..."
                  value={searchValue}
                  onChange={handleSearch}
                  className="pl-14 w-full h-16 bg-gray-50 border-none shadow-inner rounded-2xl transition-all text-base font-medium focus:ring-2 focus:ring-blue-100"
                />
                {searchValue && (
                  <button
                    onClick={() => { setSearchValue(""); setPageNumber(1); }}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {FILTERS.map((f) => {
                  const active = activeFilters.includes(f.label);
                  return (
                    <button
                      key={f.label}
                      onClick={() => toggleFilter(f.label)}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 h-16 text-xs font-black
                                  border transition-all duration-300 select-none uppercase tracking-widest whitespace-nowrap
                                  ${active
                          ? "bg-gray-900 text-white border-gray-900 shadow-xl"
                          : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600 shadow-sm"
                        }`}
                    >
                      {f.icon}
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Results Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 px-4">
          <div className="space-y-1">
             <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">
               {debouncedSearch ? `Search Results` : "Featured Jobs"}
             </h2>
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
               {totalResults} positions found
             </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-100 bg-white font-black text-[10px] uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all flex-1 sm:flex-none">
              Relevant <ChevronDown className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>
        </div>

        {/* ── Job List Content ── */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 5 }).map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-red-50 text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-lg text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed">
                We couldn't load the job listings. Please check your connection and try again.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl h-12 px-8 font-black">Try Again</Button>
            </div>
          ) : jobsData?.items?.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No Jobs Found</h3>
              <p className="text-lg text-gray-500 max-w-xs mx-auto mb-8 leading-relaxed">
                No positions match your current search criteria. Try broadening your keywords.
              </p>
              <Button onClick={() => { setSearchValue(""); setPageNumber(1); }} variant="outline" className="rounded-xl h-12 px-8 font-black">
                Browse All Jobs
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {jobsData!.items.map((job, idx) => {
                const logoColor = getLogoColor(job.companyDetails?.name);
                const hasApplied = job.iApplied;
                const isSaved = savedJobs.has(job.id);
                const matchPct = getFakeMatch(idx);
                const isHot = idx % 3 === 1;

                return (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-2 pr-6 sm:pr-8 shadow-sm hover:shadow-2xl hover:shadow-blue-50 hover:border-blue-100 transition-all duration-500 cursor-pointer flex flex-col sm:flex-row items-stretch sm:items-center gap-6"
                  >
                    {/* Company Logo & Match */}
                    <div className="p-4 sm:p-6 shrink-0 flex items-center justify-center">
                       <div className="relative">
                          <div
                            className="absolute -top-3 -left-3 z-10 flex items-center gap-1
                                       px-3 py-1.5 rounded-xl text-[10px] font-black text-white shadow-lg"
                            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
                          >
                            <Star className="w-3 h-3 fill-white" />
                            {matchPct}%
                          </div>
                          <div
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.75rem] flex items-center justify-center
                                       text-3xl font-black shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500"
                            style={{ backgroundColor: logoColor.bg, color: logoColor.text }}
                          >
                            {job.companyDetails?.profilePictureUrl ? (
                              <img
                                src={job.companyDetails.profilePictureUrl}
                                alt={job.companyDetails.name ?? "Company"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getCompanyInitial(job.companyDetails?.name)
                            )}
                          </div>
                       </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 p-4 sm:p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {job.jobTitle ?? "Untitled Position"}
                        </h3>
                        {isHot && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 w-fit">
                            <Zap className="w-3 h-3 fill-blue-500" /> Recruiting
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                        <p className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {job.companyDetails?.name || "Premium Partner"}
                        </p>
                        <p className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location || "Remote Available"}
                        </p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {getPostedLabel(job.postedDate)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                         {job.jobType && (
                           <span className="text-[10px] font-black text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl uppercase tracking-tighter border border-gray-100">
                             {job.jobType}
                           </span>
                         )}
                         {(job.salaryMin || job.salaryMax) && (
                           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-tighter border border-blue-100">
                             <DollarSign className="w-3 h-3 inline mr-0.5" />
                             {job.salaryMin && `$${(job.salaryMin / 1000).toFixed(0)}k`}
                             {job.salaryMax && ` - $${(job.salaryMax / 1000).toFixed(0)}k`}
                           </span>
                         )}
                         {job.jobRequirements?.slice(0, 1).map((req, i) => (
                           <span key={i} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-tighter border border-indigo-100">
                             {typeof req === "string" ? req : (req as { name?: string }).name ?? ""}
                           </span>
                         ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 p-6 sm:p-4 border-t sm:border-t-0 sm:border-l border-gray-50 min-w-[140px]">
                      {hasApplied ? (
                         <div className="flex flex-col items-center gap-1.5">
                           <CheckCircle className="w-6 h-6 text-green-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Applied</span>
                         </div>
                      ) : (
                        <div className="flex items-center gap-3 w-full justify-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-12 w-12 rounded-xl transition-all ${isSaved ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-300 hover:text-blue-500"}`}
                            onClick={(e) => toggleSave(e, job.id)}
                          >
                            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-blue-600" : ""}`} />
                          </Button>
                          <Button className="flex-1 sm:flex-none h-12 px-6 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.98]">
                            View
                          </Button>
                        </div>
                      )}
                      <div className="hidden sm:flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                         <Users className="w-3 h-3" /> [12] Applied
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {jobsData && jobsData.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mt-20 mb-12 px-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Page {pageNumber} of {jobsData.totalPages}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-2xl border-gray-100 bg-white text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={!jobsData.hasPreviousPage}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div className="flex items-center gap-2 px-4">
                {Array.from({ length: Math.min(jobsData.totalPages, 3) }, (_, i) => {
                  const page = i + 1;
                  const isCurrent = page === pageNumber;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[48px] h-12 rounded-2xl text-xs font-black transition-all duration-300 ${
                        isCurrent
                          ? "bg-gray-900 text-white shadow-xl shadow-gray-200 scale-110"
                          : "bg-white border border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-2xl border-gray-100 bg-white text-gray-400 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={!jobsData.hasNextPage}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsListPage;
