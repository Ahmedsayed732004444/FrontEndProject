import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { useGetAllJobs, useAddJob, useUpdateJob, useDeleteJob } from "@/features/jobs/hooks/useJobs";
import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import {
  MapPin, Briefcase, DollarSign, Plus,
  Edit, AlertTriangle, X,
  CheckCircle2, XCircle, TrendingUp,
  Search, Filter, ArrowUpDown, MoreVertical,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type { AddJobRequest, JobResponse } from "@/features/jobs/types/jobs";

/* ── helpers (unchanged) ── */
function getDaysAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
  return days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`;
}

const JobCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
    <div className="flex justify-between">
      <div className="space-y-2 flex-1"><Skeleton className="h-3 w-24" /><Skeleton className="h-5 w-2/3" /></div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
    <div className="flex gap-2"><Skeleton className="h-8 w-20 rounded-lg" /><Skeleton className="h-8 w-16 rounded-lg" /></div>
  </div>
);

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isCompany, hasPermission } = usePermissions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobResponse | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  React.useEffect(() => { if (!isCompany) navigate("/"); }, [isCompany, navigate]);

  const { data: jobsData, isLoading } = useGetAllJobs();
  const addJob       = useAddJob();
  const updateJob    = useUpdateJob();
  const deleteJob    = useDeleteJob();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      jobTitle: "", jobType: "", jobDescription: "", location: "",
      jobRequirements: [""] as string[],
      experienceLevel: null as number | null,
      salaryMin: null as number | null,
      salaryMax: null as number | null,
      deadlineDate: "",
    },
  });

  const jobRequirements = watch("jobRequirements");

  const handleJobSubmit = (data: any) => {
    const payload: AddJobRequest = {
      jobTitle: data.jobTitle, jobType: data.jobType,
      jobDescription: data.jobDescription, location: data.location || null,
      jobRequirements: data.jobRequirements.filter((r: string) => r.trim() !== ""),
      experienceLevel: data.experienceLevel ? Number(data.experienceLevel) : null,
      salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
      deadlineDate: data.deadlineDate || null,
    };
    if (editingJob) {
      updateJob.mutate({ jobId: editingJob.id, request: payload }, { onSuccess: closeForm });
    } else {
      addJob.mutate(payload, { onSuccess: closeForm });
    }
  };

  const openAddForm = () => {
    setEditingJob(null);
    reset({ jobTitle:"", jobType:"", jobDescription:"", location:"", jobRequirements:[""], experienceLevel:null, salaryMin:null, salaryMax:null, deadlineDate:"" });
    setIsFormOpen(true);
  };

  const openEditForm = (job: JobResponse) => {
    setEditingJob(job);
    reset({
      jobTitle: job.jobTitle ?? "", jobType: job.jobType ?? "",
      jobDescription: job.jobDescription ?? "", location: job.location ?? "",
      jobRequirements: job.jobRequirements ?? [""],
      experienceLevel: job.experienceLevel as any,
      salaryMin: job.salaryMin as any, salaryMax: job.salaryMax as any,
      deadlineDate: job.deadlineDate ? new Date(job.deadlineDate).toISOString().split("T")[0] : "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => { setIsFormOpen(false); setEditingJob(null); reset(); };

  const addReq    = () => setValue("jobRequirements", [...(jobRequirements ?? []), ""]);
  const removeReq = (i: number) => setValue("jobRequirements", (jobRequirements ?? []).filter((_: any, idx: number) => idx !== i));
  const updateReq = (i: number, v: string) => {
    const next = [...(jobRequirements ?? [])]; next[i] = v; setValue("jobRequirements", next);
  };

  const jobs        = jobsData?.items ?? [];
  const activeCount = jobs.filter(j => j.isActive).length;
  const inactiveCount = jobs.length - activeCount;

  const filteredJobs = jobs.filter(j =>
    !searchValue || (j.jobTitle ?? "").toLowerCase().includes(searchValue.toLowerCase())
  );

  if (!isCompany) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Portal</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your recruitment pipeline and active listings.</p>
        </div>
        {hasPermission("jobs:add") && (
          <Button
            onClick={openAddForm}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 gap-2 font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </Button>
        )}
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Jobs",   value: isLoading ? "…" : jobs.length,      icon: Briefcase,   badge: "+5%",   badgeColor: "text-green-600 bg-green-50"  },
          { label: "Active",       value: isLoading ? "…" : activeCount,      icon: CheckCircle2, badge: "0%",   badgeColor: "text-gray-500 bg-gray-100"   },
          { label: "Inactive",     value: isLoading ? "…" : inactiveCount,    icon: XCircle,     badge: "-2%",   badgeColor: "text-red-500 bg-red-50"      },
          { label: "Growth",       value: isLoading ? "…" : "+12%",           icon: TrendingUp,  badge: "+12%",  badgeColor: "text-green-600 bg-green-50"  },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-gray-500" />
              </div>
              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${s.badgeColor}`}>
                ↑ {s.badge}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Active Postings Section ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Active Postings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-lg border-gray-200 text-gray-500 text-sm h-8 gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          <Button variant="outline" className="rounded-lg border-gray-200 text-gray-500 text-sm h-8 gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort
          </Button>
        </div>
      </div>

      {/* Search / Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <Input
              placeholder="Search jobs by title or keyword..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="border-none bg-transparent h-auto text-sm text-gray-700 focus-visible:ring-0 placeholder:text-gray-400 p-0"
            />
          </div>
          <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option>All Departments</option>
          </select>
          <select className="h-9 px-3 text-sm border border-gray-200 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* ── Job Cards ── */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <Briefcase className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">No Jobs Posted Yet</h3>
          <p className="text-sm text-gray-400 mb-4 max-w-xs">Start attracting talent by posting your first job opening.</p>
          {hasPermission("jobs:add") && (
            <Button onClick={openAddForm} className="rounded-lg gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm">
              <Plus className="w-4 h-4" /> Post First Job
            </Button>
          )}
        </div>
      )}

      {!isLoading && filteredJobs.length > 0 && (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            /* progress calc: days remaining as % of 30-day window */
            const daysLeft = job.deadlineDate
              ? Math.max(0, Math.ceil((new Date(job.deadlineDate).getTime() - Date.now()) / 86_400_000))
              : null;
            const progress = daysLeft !== null ? Math.min(100, Math.round((1 - daysLeft / 30) * 100)) : 60;

            return (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5">
                {/* Top row: status + date */}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                    job.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-400">Posted {getDaysAgo(job.postedDate)}</span>
                </div>

                {/* Main row: info + apps count + actions */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-bold text-blue-700 cursor-pointer hover:text-blue-900 transition-colors mb-1.5"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      {job.jobTitle ?? "Untitled Position"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{job.location}
                        </span>
                      )}
                      {(job.salaryMin || job.salaryMax) && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="w-3 h-3" />
                          {job.salaryMin ? `$${(job.salaryMin/1000).toFixed(0)}k` : ""}
                          {job.salaryMin && job.salaryMax ? " - " : ""}
                          {job.salaryMax ? `$${(job.salaryMax/1000).toFixed(0)}k` : ""}
                        </span>
                      )}
                      {job.jobType && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />{job.jobType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apps count circle */}
                  <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-blue-100 bg-blue-50">
                    <p className="text-base font-bold text-blue-700 leading-none">—</p>
                    <p className="text-[9px] text-blue-500 font-medium uppercase">APPS</p>
                  </div>

                  {/* Action buttons */}
                  <div className="shrink-0 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View
                    </Button>
                    {hasPermission("jobs:update") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg border-gray-200 text-gray-600 text-xs font-semibold px-4 hover:bg-gray-50"
                        onClick={() => openEditForm(job)}
                      >
                        Edit
                      </Button>
                    )}

                    {/* More menu */}
                    <div className="relative">
                      {deleteConfirmId === job.id ? (
                        <div className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2 py-1">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <button className="text-[11px] text-gray-500 hover:text-gray-700" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                          <button className="text-[11px] font-bold text-red-600" onClick={() => { deleteJob.mutate(job.id); setDeleteConfirmId(null); }} disabled={deleteJob.isPending}>Delete</button>
                        </div>
                      ) : (
                        <button
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
                          onClick={() => setDeleteConfirmId(job.id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>Health: {daysLeft !== null ? `${daysLeft} days left` : "No deadline"}</span>
                    <span>{progress}% Complete</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {jobsData && (jobsData as any).totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">‹</button>
          {[1, 2, 3].map(p => (
            <button key={p} className={`w-8 h-8 rounded border text-sm font-medium ${p === 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {p}
            </button>
          ))}
          <span className="px-1 text-gray-400">...</span>
          <button className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">›</button>
        </div>
      )}

      {/* ── Add / Edit Dialog (unchanged) ── */}
      <Dialog open={isFormOpen} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border-gray-200 p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  {editingJob ? <Edit className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{editingJob ? "Editing Job" : "New Posting"}</p>
                  <DialogTitle className="text-base font-bold text-gray-900 mt-0.5">{editingJob ? "Edit Job Details" : "Post a New Job"}</DialogTitle>
                </div>
              </div>
              <button onClick={closeForm} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleJobSubmit)} className="px-6 py-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-700">Job Title <span className="text-red-500">*</span></Label>
                <Input id="jobTitle" placeholder="e.g. Senior Frontend Developer" className="h-10 rounded-lg border-gray-200" {...register("jobTitle", { required: true })} />
                {errors.jobTitle && <p className="text-xs text-red-500">Required.</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobType" className="text-sm font-semibold text-gray-700">Job Type <span className="text-red-500">*</span></Label>
                <Input id="jobType" placeholder="e.g. Full-time, Contract" className="h-10 rounded-lg border-gray-200" {...register("jobType", { required: true })} />
                {errors.jobType && <p className="text-xs text-red-500">Required.</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobDescription" className="text-sm font-semibold text-gray-700">Description <span className="text-red-500">*</span></Label>
              <Textarea id="jobDescription" rows={4} placeholder="Describe the role, responsibilities, and team…" className="rounded-lg border-gray-200 resize-none" {...register("jobDescription", { required: true })} />
              {errors.jobDescription && <p className="text-xs text-red-500">Required.</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</Label>
              <Input id="location" placeholder="e.g. New York / Remote" className="h-10 rounded-lg border-gray-200" {...register("location")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="salaryMin" className="text-sm font-semibold text-gray-700">Min Salary</Label>
                <Input id="salaryMin" type="number" placeholder="50000" className="h-10 rounded-lg border-gray-200" {...register("salaryMin")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salaryMax" className="text-sm font-semibold text-gray-700">Max Salary</Label>
                <Input id="salaryMax" type="number" placeholder="90000" className="h-10 rounded-lg border-gray-200" {...register("salaryMax")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadlineDate" className="text-sm font-semibold text-gray-700">Deadline</Label>
                <Input id="deadlineDate" type="date" className="h-10 rounded-lg border-gray-200" {...register("deadlineDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Requirements</Label>
              <div className="space-y-2">
                {(jobRequirements ?? []).map((req: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-[10px] font-bold text-blue-600">{i + 1}</span>
                    <Input value={req} onChange={(e) => updateReq(i, e.target.value)} placeholder={`Requirement ${i + 1}`} className="h-9 rounded-lg border-gray-200 flex-1 text-sm" />
                    <button type="button" onClick={() => removeReq(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addReq} className="rounded-lg gap-1.5 h-8 text-xs font-semibold border-gray-200">
                <Plus className="w-3.5 h-3.5" /> Add Requirement
              </Button>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={closeForm} className="flex-1 h-10 rounded-lg font-semibold border-gray-200">Cancel</Button>
              <Button type="submit" className="flex-1 h-10 rounded-lg font-semibold gap-2 bg-blue-600 hover:bg-blue-700 text-white" disabled={addJob.isPending || updateJob.isPending}>
                {addJob.isPending || updateJob.isPending ? "Saving…" : editingJob ? "Save Changes" : "Post Job"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyDashboard;
