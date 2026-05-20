import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { ApplicationStatusLabels } from "@/features/job-tracker/types/jobTracker";
import type { JobApplicationFormData } from "@/features/job-tracker/schemas/jobTrackerSchemas";
import type { UseFormReturn } from "react-hook-form";

interface JobTrackerSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  form: UseFormReturn<JobApplicationFormData>;
  onSubmit: (data: JobApplicationFormData) => void;
  isPending: boolean;
  onReset: () => void;
}

export const JobTrackerSheet: React.FC<JobTrackerSheetProps> = ({
  isOpen,
  onOpenChange,
  isEditing,
  form,
  onSubmit,
  isPending,
  onReset,
}) => {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 gap-2 font-semibold shadow-sm w-full sm:w-auto justify-center"
          onClick={onReset}
        >
          <Plus className="w-4 h-4" /> Add Application
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Application" : "Add Application"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <Label htmlFor="jobTitle">Job Title *</Label>
            <Input id="jobTitle" {...register("jobTitle")} />
            {errors.jobTitle && <p className="text-sm text-destructive mt-1">{errors.jobTitle.message}</p>}
          </div>
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" {...register("companyName")} />
            {errors.companyName && <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>}
          </div>
          <div>
            <Label htmlFor="applicationDate">Application Date</Label>
            <Input id="applicationDate" type="date" {...register("applicationDate")} />
            {errors.applicationDate && <p className="text-sm text-destructive mt-1">{errors.applicationDate.message}</p>}
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <select id="status" {...register("status")} className="w-full p-2 border rounded-md text-sm">
              {Object.entries(ApplicationStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
          </div>
          <div>
            <Label htmlFor="applicationSource">Application Source</Label>
            <Input id="applicationSource" {...register("applicationSource")} placeholder="e.g., LinkedIn, Company Website" />
            {errors.applicationSource && <p className="text-sm text-destructive mt-1">{errors.applicationSource.message}</p>}
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} {...register("notes")} placeholder="Add any notes about this application..." />
            {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Application" : "Add Application"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
