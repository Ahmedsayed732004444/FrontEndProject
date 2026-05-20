import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authService } from "@/features/auth/services/authService";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useGetJobApplications, useAddJobApplication, useUpdateJobApplication, useDeleteJobApplication } from "@/features/job-tracker/hooks/useJobTracker";
import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";

import { Plus, Edit, Trash2, Briefcase, Building, Calendar, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobApplicationSchema, type JobApplicationFormData } from "@/features/job-tracker/schemas/jobTrackerSchemas";
import { ApplicationStatus, ApplicationStatusLabels, ApplicationStatusColors } from "@/features/job-tracker/types/jobTracker";

const JobTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<any>(null);

  // Redirect unauthenticated users
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { data: applicationsData, isLoading } = useGetJobApplications({
    searchValue: debouncedSearch,
    pageNumber,
    pageSize,
  });

  const addApplication = useAddJobApplication();
  const updateApplication = useUpdateJobApplication();
  const deleteApplication = useDeleteJobApplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema) as any,
    defaultValues: {
      jobTitle: "",
      companyName: "",
      applicationDate: "",
      status: ApplicationStatus.Applied,
      applicationSource: "",
      notes: "",
    },
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  };

  const handlePageChange = (newPageNumber: number) => {
    setPageNumber(newPageNumber);
  };

  const handleAddApplication = (data: JobApplicationFormData) => {
    addApplication.mutate(data, {
      onSuccess: () => {
        setIsAddOpen(false);
        reset();
      }
    });
  };

  const handleEditApplication = (application: any) => {
    setEditingApplication(application);
    reset({
      jobTitle: application.jobTitle || "",
      companyName: application.companyName || "",
      applicationDate: application.applicationDate ? new Date(application.applicationDate).toISOString().split('T')[0] : "",
      status: String(application.status) as any,
      applicationSource: application.applicationSource || "",
      notes: application.notes || "",
    });
    setIsAddOpen(true);
  };


  const handleUpdateApplication = (data: JobApplicationFormData) => {
    if (!editingApplication) return;
    
    updateApplication.mutate({
      id: editingApplication.id,
      request: data,
    }, {
      onSuccess: () => {
        setIsAddOpen(false);
        setEditingApplication(null);
        reset();
      }
    });
  };

  const handleDeleteApplication = (application: any) => {
    if (window.confirm(`Are you sure you want to delete this application?`)) {
      deleteApplication.mutate(application.id);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-gray-900">Sign In Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">Please log in to your account to manage your job applications.</p>
          <Button 
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48 rounded-xl" />
              <Skeleton className="h-5 w-64 rounded-lg" />
            </div>
            <Skeleton className="h-12 w-40 rounded-xl hidden sm:block" />
          </div>
          <Skeleton className="h-14 w-full rounded-2xl mb-8" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm flex items-center gap-4">
                <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/2 rounded-lg" />
                  <Skeleton className="h-4 w-1/3 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  /* ── status badge helper ── */
  const getStatusBadge = (status: ApplicationStatus) => {
    const label = ApplicationStatusLabels[status] ?? String(status);
    const color = ApplicationStatusColors[status] ?? "#6b7280";
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-xl border uppercase tracking-wider"
        style={{
          backgroundColor: color + "12",
          color,
          borderColor: color + "20",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Job Tracker</h1>
            <p className="text-lg text-gray-500 font-medium leading-tight">Keep track of your career progress.</p>
          </div>

          <Sheet open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open);
            if (!open) setEditingApplication(null);
          }}>
            <SheetTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 gap-3 font-bold shadow-xl shadow-blue-200 w-full sm:w-auto justify-center transition-all active:scale-[0.98]"
                onClick={() => {
                  setEditingApplication(null);
                  reset({ jobTitle: "", companyName: "", applicationDate: "", status: ApplicationStatus.Applied, applicationSource: "", notes: "" });
                }}
              >
                <Plus className="w-5 h-5" /> Add Application
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl rounded-l-[2.5rem] p-8">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black tracking-tight">{editingApplication ? "Update Details" : "New Application"}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit((editingApplication ? handleUpdateApplication : handleAddApplication) as any)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title *</Label>
                  <Input id="jobTitle" {...register("jobTitle")} className="h-12 rounded-xl bg-muted/50 border-none shadow-inner" placeholder="e.g. Senior Frontend Developer" />
                  {errors.jobTitle && <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.jobTitle.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Company Name</Label>
                  <Input id="companyName" {...register("companyName")} className="h-12 rounded-xl bg-muted/50 border-none shadow-inner" placeholder="e.g. Google" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationDate" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Date Applied</Label>
                    <Input id="applicationDate" type="date" {...register("applicationDate")} className="h-12 rounded-xl bg-muted/50 border-none shadow-inner text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Status *</Label>
                    <select id="status" {...register("status")} className="w-full h-12 rounded-xl bg-muted/50 border-none shadow-inner text-xs px-3 font-medium outline-none">
                      {Object.entries(ApplicationStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationSource" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Application Source</Label>
                  <Input id="applicationSource" {...register("applicationSource")} className="h-12 rounded-xl bg-muted/50 border-none shadow-inner" placeholder="e.g. LinkedIn" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Notes & Details</Label>
                  <Textarea id="notes" rows={4} {...register("notes")} className="rounded-2xl bg-muted/50 border-none shadow-inner resize-none p-4 text-sm" placeholder="Any specific details about the interview process..." />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-xl shadow-blue-200 mt-4 transition-all active:scale-[0.98]" disabled={addApplication.isPending || updateApplication.isPending}>
                  {addApplication.isPending || updateApplication.isPending ? "Saving..." : editingApplication ? "Update Application" : "Save Application"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>


        {/* ── Search + Filter Bar ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <Input
              placeholder="Search by job title or company..."
              value={searchValue}
              onChange={handleSearch}
              className="pl-12 w-full h-14 bg-white border-gray-100 shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-2xl transition-all text-base"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-2xl border-gray-100 h-14 px-6 bg-white shadow-sm hover:bg-gray-50 flex-1 md:flex-none font-bold text-gray-600 gap-2">
              <Calendar className="w-4 h-4" /> Newest
            </Button>
          </div>
        </div>

        {/* ── Applications List ── */}
        <div className="space-y-4">
          {applicationsData?.items?.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{searchValue ? "No Results Found" : "Start Tracking Today"}</h3>
              <p className="text-lg text-gray-500 max-w-xs mx-auto leading-relaxed">
                {searchValue ? "We couldn't find any applications matching your search terms." : "Add your first job application and start managing your journey to success."}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {applicationsData?.items?.map((application, idx) => (
              <div
                key={application.id}
                className="group bg-white border border-gray-100 rounded-[2rem] p-2 pr-4 md:pr-6 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                onClick={() => handleEditApplication(application)}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="flex items-center gap-4 p-4 flex-1">
                  {/* Company avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner group-hover:from-blue-50 group-hover:to-white transition-colors">
                    <span className="text-xl font-black text-gray-400 group-hover:text-blue-500 transition-colors">
                      {(application.companyName || "?")[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                      {application.jobTitle || "Untitled Position"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 opacity-60" />
                        {application.companyName || "Unknown"}
                      </p>
                      {application.applicationSource && (
                        <p className="text-xs font-semibold text-gray-400 px-2 py-0.5 bg-gray-50 rounded-lg">
                          {application.applicationSource}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status + Date (Desktop) */}
                <div className="hidden sm:flex flex-col items-end shrink-0 py-4 min-w-[140px]">
                  {getStatusBadge(application.status)}
                  {application.applicationDate && (
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tighter">
                      Applied {new Date(application.applicationDate).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                    </p>
                  )}
                </div>

                {/* Mobile Status Row */}
                <div className="flex sm:hidden items-center justify-between px-6 pb-4 pt-0 border-t border-gray-50">
                   <div className="flex gap-2 pt-4">
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-10 w-10 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                       onClick={(e) => { e.stopPropagation(); handleEditApplication(application); }}
                     >
                       <Edit className="w-4 h-4" />
                     </Button>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-10 w-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50"
                       onClick={(e) => { e.stopPropagation(); handleDeleteApplication(application); }}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   <div className="pt-4 flex flex-col items-end">
                     {getStatusBadge(application.status)}
                      {application.applicationDate && (
                        <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                          {new Date(application.applicationDate).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}
                        </span>
                      )}
                   </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditApplication(application)}
                    className="w-10 h-10 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteApplication(application)}
                    className="w-10 h-10 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pagination ── */}
        {(applicationsData?.hasNextPage || applicationsData?.hasPreviousPage) && (
          <div className="flex items-center justify-center gap-3 mt-12 mb-10">
            {applicationsData.hasPreviousPage && (
              <Button
                variant="outline"
                className="h-12 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-gray-600 px-6 hover:bg-gray-50"
                onClick={() => handlePageChange(pageNumber - 1)}
              >
                ← Previous
              </Button>
            )}
            
            {applicationsData.hasNextPage && (
              <Button
                variant="outline"
                className="h-12 rounded-xl border-gray-100 bg-white shadow-sm font-bold text-gray-600 px-8 hover:bg-gray-50 gap-2 shadow-xl shadow-gray-100"
                onClick={() => handlePageChange(pageNumber + 1)}
              >
                Load More <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobTrackerPage;
