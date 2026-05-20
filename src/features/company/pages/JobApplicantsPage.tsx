import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useGetJobApplicants } from "@/features/jobs/hooks/useJobs";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Mail, Phone, Calendar, Download,
  Search, Users, AlertCircle, ChevronLeft, ChevronRight,
  FileText, MoreHorizontal,
} from "lucide-react";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const getFullUrl = (path: string | null | undefined, apiBase: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const base = apiBase.replace("/api", "");
  return `${base}/${path.replace(/\\/g, "/")}`;
};

function formatDate(d: string) {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getDaysAgo(d: string) {
  if (!d) return "";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}

const ApplicantSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
    <div className="flex items-start gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-11 flex-1 rounded-xl" />
      <Skeleton className="h-11 flex-1 rounded-xl" />
    </div>
  </div>
);

const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isCompany } = usePermissions();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    if (!isCompany) navigate("/");
  }, [isCompany, navigate]);

  const { data, isLoading, error } = useGetJobApplicants(jobId ?? "", {
    searchValue: debouncedSearch,
    pageNumber,
    pageSize,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  };

  const applicants = data?.items ?? [];
  const total = (data?.totalPages ?? 0) * pageSize;

  if (!isCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Job Applicants
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Senior Product Designer
              </span>
              {!isLoading && !error && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                  {total} Candidates
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <Input
                placeholder="Search candidates..."
                value={searchValue}
                onChange={handleSearch}
                className="pl-12 w-full md:w-72 lg:w-96 h-12 bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-2xl transition-all text-base"
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    setPageNumber(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="rounded-2xl border-gray-200 text-gray-500 h-12 w-12 p-0 shrink-0 bg-white hover:bg-gray-50 shadow-sm transition-all"
            >
              <MoreHorizontal className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <ApplicantSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-8 animate-pulse">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              Unable to load applicants
            </h3>
            <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
              We encountered a technical issue while fetching the candidates list. Please check your connection and try again.
            </p>
            <Button
              variant="default"
              onClick={() => window.location.reload()}
              className="rounded-2xl px-10 h-14 bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200 transition-all active:scale-[0.98]"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {!isLoading && !error && applicants.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center mb-8">
              <Users className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              {searchValue ? "No matching candidates" : "No applications yet"}
            </h3>
            <p className="text-gray-500 max-w-md text-lg leading-relaxed">
              {searchValue
                ? `We couldn't find any applicants matching "${searchValue}". Try using broader search terms.`
                : "It looks like no one has applied for this position yet."}
            </p>
            {searchValue && (
              <Button
                variant="outline"
                onClick={() => setSearchValue("")}
                className="mt-10 rounded-2xl px-8 h-12 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}

        {!isLoading && !error && applicants.length > 0 && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {applicants.map((applicant, idx) => {
                const cvUrl = getFullUrl(applicant.cvPath || applicant.cVPath, env.API_BASE_URL);
                const imgUrl = getFullUrl(applicant.applicantImageUrl, env.API_BASE_URL);
                const initials = (applicant.applicantName ?? "?")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={applicant.id}
                    className="group bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-500 overflow-hidden flex flex-col"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div
                          className="flex items-center gap-4 cursor-pointer min-w-0"
                          onClick={() => {
                            const id = (applicant as any).applicantionId ||
                              (applicant as any).applicantId ||
                              (applicant as any).ApplicantId ||
                              (applicant as any).userId ||
                              (applicant as any).UserId ||
                              applicant.id;

                            if (id && id !== "undefined") {
                              navigate(`/profile/${id}`);
                            }
                          }}
                        >
                          <div className="relative shrink-0">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={applicant.applicantName}
                                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all duration-500"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all duration-500">
                                <span className="text-xl font-black text-gray-400">
                                  {initials}
                                </span>
                              </div>
                            )}
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm" />
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-black text-gray-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                              {applicant.applicantName}
                            </h3>
                            <div className="flex flex-col gap-1 mt-1.5">
                              <span className="text-xs font-medium text-gray-500 flex items-center gap-2 truncate">
                                <Mail className="w-4 h-4 shrink-0 opacity-40" />
                                <span className="truncate">{applicant.applicantEmail}</span>
                              </span>
                              {applicant.phone && (
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-2">
                                  <Phone className="w-4 h-4 shrink-0 opacity-40" />
                                  {applicant.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-10 w-10 p-0 rounded-xl shrink-0 transition-all"
                        >
                          <MoreHorizontal className="w-6 h-6" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-3 mb-6 py-4 border-y border-gray-50">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <Calendar className="w-4 h-4 text-gray-300" />
                          <span className="uppercase tracking-wider">Applied {formatDate(applicant.appliedAt)}</span>
                        </div>
                        <span className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-blue-50/50 text-blue-600 uppercase tracking-widest border border-blue-100/50">
                          {getDaysAgo(applicant.appliedAt)}
                        </span>
                      </div>

                      <div className="flex-1 mb-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">
                          Applicant Summary
                        </h4>
                        <div className="bg-gray-50/50 rounded-3xl p-5 border border-gray-50 group-hover:bg-blue-50/30 transition-colors duration-500">
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4 italic font-medium">
                            {applicant.notes
                              ? `"${applicant.notes}"`
                              : "No professional notes provided."}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-auto pt-2">
                        <Button
                          size="lg"
                          className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black gap-2 shadow-xl shadow-blue-200/50 active:scale-[0.98] transition-all"
                          onClick={() => cvUrl && window.open(cvUrl, "_blank")}
                          disabled={!cvUrl}
                        >
                          <Download className="w-5 h-5" /> CV
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 h-14 rounded-2xl border-gray-200 text-gray-700 text-sm font-black gap-2 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all"
                          onClick={() => cvUrl && window.open(cvUrl, "_blank")}
                          disabled={!cvUrl}
                        >
                          <FileText className="w-5 h-5" /> View
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6 pb-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPageNumber((p) => p - 1)}
                  disabled={!data.hasPreviousPage}
                  className="w-12 h-12 rounded-2xl border-gray-200 shadow-sm hover:shadow-md transition-all disabled:opacity-30"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from(
                    { length: Math.min(data.totalPages, 5) },
                    (_, i) => {
                      const page = i + 1;
                      const isCurrent = page === pageNumber;
                      return (
                        <Button
                          key={page}
                          variant={isCurrent ? "default" : "outline"}
                          size="icon"
                          onClick={() => setPageNumber(page)}
                          className={cn(
                            "w-12 h-12 rounded-2xl font-black text-sm shadow-sm transition-all duration-300",
                            isCurrent
                              ? "bg-blue-600 hover:bg-blue-700 border-none scale-110 shadow-blue-200 shadow-lg"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}

                  {data.totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-400 font-black">...</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPageNumber(data.totalPages)}
                        className="w-12 h-12 rounded-2xl border-gray-200 text-gray-600 font-black shadow-sm"
                      >
                        {data.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPageNumber((p) => p + 1)}
                  disabled={!data.hasNextPage}
                  className="w-12 h-12 rounded-2xl border-gray-200 shadow-sm hover:shadow-md transition-all disabled:opacity-30"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicantsPage;
