import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetJobById, useApplyToJob, useUpdateJob,
  useDeleteJob, useToggleJobStatus, useGenerateQuestions,
} from "@/features/jobs/hooks/useJobs";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { authService } from "@/features/auth/services/authService";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";

import { JobApplySheet } from "@/features/jobs/components/JobApplySheet";
import {
  Edit, Trash2, Power, Eye, BrainCircuit,
  ArrowLeft, CheckCircle2, XCircle,
  AlertTriangle, Plus, X, DollarSign,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { ApplyJobRequest, AddJobRequest } from "@/features/jobs/types/jobs";


/* ─────────────────────────────────────────
   Loading skeleton
───────────────────────────────────────── */
const DetailsSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="h-48 bg-muted animate-pulse" />
    <div className="container max-w-5xl mx-auto px-4 -mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);


/* ─────────────────────────────────────────
   Main page
───────────────────────────────────────── */
const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCompany, hasPermission } = usePermissions();
  const [isApplySheetOpen, setIsApplySheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data: job, isLoading, error } = useGetJobById(id ?? "");
  const applyToJob    = useApplyToJob();
  const updateJob     = useUpdateJob();
  const deleteJob     = useDeleteJob();
  const toggleStatus  = useToggleJobStatus();
  const genQuestions  = useGenerateQuestions();
  const isAuthenticated = authService.isAuthenticated();

  const {
    register, handleSubmit, setValue, watch, reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jobTitle: "",
      jobType: "",
      jobDescription: "",
      location: "",
      jobRequirements: [""] as string[],
      experienceLevel: null as number | null,
      salaryMin: null as number | null,
      salaryMax: null as number | null,
      deadlineDate: "",
    },
  });

  const jobRequirements = watch("jobRequirements");

  /* ── Handlers ── */
  const handleApply = (data: ApplyJobRequest) => {
    if (!job) return;
    applyToJob.mutate({ jobId: job.id, request: data });
    setIsApplySheetOpen(false);
  };

  const handleEditClick = () => {
    if (!job) return;
    reset({
      jobTitle: job.jobTitle ?? "",
      jobType: job.jobType ?? "",
      jobDescription: job.jobDescription ?? "",
      location: job.location ?? "",
      jobRequirements: job.jobRequirements ?? [""],
      experienceLevel: job.experienceLevel as any,
      salaryMin: job.salaryMin as any,
      salaryMax: job.salaryMax as any,
      deadlineDate: job.deadlineDate ? new Date(job.deadlineDate).toISOString().split("T")[0] : "",
    });
    setIsEditSheetOpen(true);
  };

  const handleUpdateJob = (data: any) => {
    if (!job) return;
    const jobData: AddJobRequest = {
      jobTitle: data.jobTitle,
      jobType: data.jobType,
      jobDescription: data.jobDescription,
      location: data.location || null,
      jobRequirements: data.jobRequirements.filter((r: string) => r.trim() !== ""),
      experienceLevel: data.experienceLevel ? Number(data.experienceLevel) : null,
      salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
      deadlineDate: data.deadlineDate || null,
    };
    updateJob.mutate({ jobId: job.id, request: jobData }, {
      onSuccess: () => setIsEditSheetOpen(false),
    });
  };

  const handleDeleteJob = () => {
    if (!job) return;
    deleteJob.mutate(job.id, {
      onSuccess: () => navigate("/company/dashboard"),
    });
  };

  const addRequirement = () =>
    setValue("jobRequirements", [...(jobRequirements ?? []), ""]);

  const removeRequirement = (i: number) =>
    setValue("jobRequirements", (jobRequirements ?? []).filter((_: any, idx: number) => idx !== i));

  const updateRequirement = (i: number, val: string) => {
    const next = [...(jobRequirements ?? [])];
    next[i] = val;
    setValue("jobRequirements", next);
  };

  /* ── Loading ── */
  if (isLoading) return <DetailsSkeleton />;

  /* ── Error ── */
  if (error || !job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Job Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn't load this job listing. It may have been removed or the link is invalid.
          </p>
          <Button onClick={() => navigate("/jobs")} className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  /* ── Page ── */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ══ Main Column ══ */}
          <div className="lg:col-span-2 space-y-4">

            {/* Back */}
            <button onClick={() => navigate("/jobs")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Jobs
            </button>

            {/* Job Header Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div 
                  className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity mx-auto sm:mx-0"
                  onClick={() => navigate(`/profile/${job.companyDetails?.companyId}`)}
                >
                  {job.companyDetails?.profilePictureUrl ? (
                    <img src={job.companyDetails.profilePictureUrl} alt={job.companyDetails.name ?? ""}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                      <span className="text-xl sm:text-2xl font-bold text-blue-500">
                        {(job.companyDetails?.name ?? "C")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight truncate">
                        {job.jobTitle ?? "Untitled Position"}
                      </h1>
                      <p 
                        className="text-blue-600 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1 cursor-pointer hover:underline"
                        onClick={() => navigate(`/profile/${job.companyDetails?.companyId}`)}
                      >
                        {job.companyDetails?.name ?? "Company"}
                        {job.isActive && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                      </p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
                      {job.iApplied && (
                        <Badge className="bg-green-50 text-green-700 border-green-200 gap-1 text-xs font-semibold px-2.5 py-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Applied
                        </Badge>
                      )}
                      {!job.isActive && (
                        <Badge variant="outline" className="text-gray-500 text-xs px-2.5 py-0.5">
                          <XCircle className="w-3 h-3 mr-1" /> Closed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
                    {job.location && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 border border-gray-100 rounded-full px-3 py-1 bg-gray-50/50 font-medium">
                        📍 {job.location}
                      </span>
                    )}
                    {(job.salaryMin || job.salaryMax) && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 border border-gray-100 rounded-full px-3 py-1 bg-gray-50/50 font-medium">
                        💵 ${job.salaryMin?.toLocaleString() ?? "?"} – ${job.salaryMax?.toLocaleString() ?? "?"}
                      </span>
                    )}
                    {job.jobType && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 border border-gray-100 rounded-full px-3 py-1 bg-gray-50/50 font-medium">
                        🕐 {job.jobType}
                      </span>
                    )}
                    {job.deadlineDate && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 border border-gray-100 rounded-full px-3 py-1 bg-gray-50/50 font-medium">
                        📅 {new Date(job.deadlineDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Overview */}
            {job.jobDescription && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-base font-bold text-gray-900 mb-3">Role Overview</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{job.jobDescription}</p>
              </div>
            )}

            {/* Responsibilities + Requirements */}
            {job.jobRequirements && job.jobRequirements.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <h3 className="font-bold text-gray-900 text-sm">Key Responsibilities</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {job.jobRequirements.slice(0, Math.ceil(job.jobRequirements.length / 2)).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      <h3 className="font-bold text-gray-900 text-sm">Requirements</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {job.jobRequirements.slice(Math.ceil(job.jobRequirements.length / 2)).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowLeft className="w-3 h-3 text-blue-500 shrink-0 mt-1 -rotate-180" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Company management */}
            {isCompany && hasPermission("jobs:update") && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Employer Controls</h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200 text-xs font-semibold h-9"
                    onClick={() => navigate(`/company/jobs/${job.id}/applicants`)}>
                    <Eye className="w-3.5 h-3.5 text-blue-500" /> Applicants
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200 text-xs font-semibold h-9"
                    onClick={() => toggleStatus.mutate({ jobId: job.id })} disabled={toggleStatus.isPending}>
                    <Power className="w-3.5 h-3.5" /> {job.isActive ? "Pause" : "Resume"}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200 text-xs font-semibold h-9"
                    onClick={handleEditClick}>
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  {!deleteConfirm ? (
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl border-red-100 text-red-500 hover:bg-red-50 text-xs font-semibold h-9"
                      onClick={() => setDeleteConfirm(true)}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  ) : (
                    <div className="col-span-2 flex items-center justify-between gap-3 bg-red-50 p-2 rounded-xl border border-red-100 mt-1">
                      <span className="text-[10px] text-red-600 font-bold uppercase tracking-tight flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Confirm Delete?
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-7 text-xs font-bold hover:bg-white/50"
                          onClick={() => setDeleteConfirm(false)} disabled={deleteJob.isPending}>No</Button>
                        <Button size="sm" className="h-7 text-xs font-bold bg-red-500 hover:bg-red-600 text-white"
                          onClick={handleDeleteJob} disabled={deleteJob.isPending}>
                          Yes, Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ══ Right Sidebar ══ */}
          <div className="space-y-4">

            {/* Ready to Apply */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-1">Ready to Apply?</h3>
              <p className="text-xs text-gray-500 mb-4">
                {job.deadlineDate
                  ? `Applications close ${new Date(job.deadlineDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}. Join our engineering team today.`
                  : "Join our team today. Submit your application now."}
              </p>

              {job.iApplied ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                  <CheckCircle2 className="w-7 h-7 text-green-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-green-700">Application Submitted</p>
                  <p className="text-xs text-green-600 mt-0.5">You've already applied.</p>
                </div>
              ) : !isAuthenticated ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg h-10 gap-2"
                  onClick={() => navigate("/login")}>
                  Sign In to Apply
                </Button>
              ) : (
                <div className="space-y-2">
                  <JobApplySheet
                    jobTitle={job.jobTitle ?? "this Position"}
                    isOpen={isApplySheetOpen}
                    onOpenChange={setIsApplySheetOpen}
                    onSubmit={handleApply}
                    isSubmitting={applyToJob.isPending}
                  />
                  <Button variant="outline" className="w-full rounded-lg h-10 border-gray-300 text-gray-700 font-medium gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Save for Later
                  </Button>
                </div>
              )}
            </div>

            {/* AI Interview Prep */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">AI Interview Prep</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Practice technical questions tailored specifically for this {job.jobType ?? ""} role at <span 
                  className="text-blue-600 cursor-pointer hover:underline font-medium"
                  onClick={() => navigate(`/profile/${job.companyDetails?.companyId}`)}
                >
                  {job.companyDetails?.name ?? "this company"}
                </span>.
              </p>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                onClick={() => navigate(`/interview/${job.id}`)}>
                Start Mock Interview →
              </button>
              {isCompany && (
                <Button variant="outline" size="sm" className="w-full mt-3 rounded-lg border-gray-200 gap-2 text-xs"
                  onClick={() => genQuestions.mutate(job.id)} disabled={genQuestions.isPending}>
                  <BrainCircuit className="w-3.5 h-3.5" />
                  {genQuestions.isPending ? "Generating…" : "Generate Questions"}
                </Button>
              )}
            </div>

            {/* Similar Roles */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Similar Roles</h3>
              <div className="space-y-3">
                {[
                  { title: "Staff UI Engineer", company: "CloudMatrix", location: "Remote" },
                  { title: "Lead Frontend Developer", company: "Nexus Systems", location: "New York" },
                  { title: "Senior React Developer", company: "FinTech Solutions", location: "Remote" },
                ].map((role, i) => (
                  <div key={i} className={i < 2 ? "pb-3 border-b border-gray-100" : ""}>
                    <p className="text-sm font-semibold text-gray-900">{role.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{role.company} • {role.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── Edit Sheet ── */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Edit className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Editing
                </p>
                <SheetTitle className="text-base font-extrabold leading-tight mt-0.5">
                  Job Details
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>

          <form onSubmit={handleSubmit(handleUpdateJob)} className="space-y-5 pt-6">

            {/* Job Title */}
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle" className="text-sm font-bold">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobTitle"
                className="h-10 rounded-xl border-border/60"
                placeholder="e.g. Senior Frontend Developer"
                {...register("jobTitle", { required: true })}
              />
              {errors.jobTitle && <p className="text-xs text-destructive font-medium">Job title is required.</p>}
            </div>

            {/* Job Type */}
            <div className="space-y-1.5">
              <Label htmlFor="jobType" className="text-sm font-bold">
                Job Type <span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobType"
                className="h-10 rounded-xl border-border/60"
                placeholder="e.g. Full-time, Contract"
                {...register("jobType", { required: true })}
              />
              {errors.jobType && <p className="text-xs text-destructive font-medium">Job type is required.</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="jobDescription" className="text-sm font-bold">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                rows={4}
                className="rounded-xl border-border/60 resize-none"
                placeholder="Describe the role, responsibilities, and team…"
                {...register("jobDescription", { required: true })}
              />
              {errors.jobDescription && <p className="text-xs text-destructive font-medium">Description is required.</p>}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-bold">Location</Label>
              <Input
                id="location"
                className="h-10 rounded-xl border-border/60"
                placeholder="e.g. New York, NY / Remote"
                {...register("location")}
              />
            </div>

            {/* Salary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="salaryMin" className="text-sm font-bold flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Min Salary
                </Label>
                <Input
                  id="salaryMin"
                  type="number"
                  className="h-10 rounded-xl border-border/60"
                  placeholder="50000"
                  {...register("salaryMin")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salaryMax" className="text-sm font-bold flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Max Salary
                </Label>
                <Input
                  id="salaryMax"
                  type="number"
                  className="h-10 rounded-xl border-border/60"
                  placeholder="90000"
                  {...register("salaryMax")}
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <Label htmlFor="deadlineDate" className="text-sm font-bold">Application Deadline</Label>
              <Input
                id="deadlineDate"
                type="date"
                className="h-10 rounded-xl border-border/60"
                {...register("deadlineDate")}
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">Requirements</Label>
              <div className="space-y-2">
                {(jobRequirements ?? []).map((req: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-black text-primary">
                      {i + 1}
                    </span>
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(i, e.target.value)}
                      placeholder={`Requirement ${i + 1}`}
                      className="h-9 rounded-xl border-border/60 flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(i)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl gap-1.5 h-8 text-xs font-bold mt-1 border-border/60"
                onClick={addRequirement}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Requirement
              </Button>
            </div>

            {/* Submit */}
            <div className="pt-2 pb-2">
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold gap-2"
                disabled={updateJob.isPending}
              >
                {updateJob.isPending ? "Saving Changes…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default JobDetailsPage;
