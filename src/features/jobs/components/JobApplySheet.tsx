import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Phone, MessageSquare, Upload, Send, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { applyJobSchema } from "@/features/jobs/schemas/jobSchemas";
import type { ApplyJobRequest } from "@/features/jobs/types/jobs";

interface JobApplySheetProps {
  jobTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ApplyJobRequest) => void;
  isSubmitting: boolean;
}

export const JobApplySheet: React.FC<JobApplySheetProps> = ({
  jobTitle,
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplyJobRequest>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: { phone: "", notes: "" },
  });

  const cvFile = watch("cv");
  const hasFile = cvFile && (cvFile as unknown as FileList)?.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="w-full h-11 rounded-xl font-bold gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
          <Send className="w-4 h-4" />
          Apply Now
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-6 border-b border-border/60">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Quick Apply
              </p>
              <SheetTitle className="text-base font-extrabold leading-tight mt-0.5">
                {jobTitle}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-6">

          {/* CV Upload */}
          <div className="space-y-2">
            <Label htmlFor="cv" className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              CV / Resume <span className="text-destructive">*</span>
            </Label>
            <label
              htmlFor="cv"
              className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                hasFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/40 bg-muted/20"
              }`}
            >
              <Upload className={`w-6 h-6 mb-2 ${hasFile ? "text-primary" : "text-muted-foreground/40"}`} />
              <p className={`text-xs font-bold ${hasFile ? "text-primary" : "text-muted-foreground/60"}`}>
                {hasFile
                  ? (cvFile as unknown as FileList)[0]?.name ?? "File selected"
                  : "Click to upload your CV"}
              </p>
              <p className="text-[10px] text-muted-foreground/40 mt-0.5">PDF, DOC, DOCX</p>
              <Input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                {...register("cv")}
              />
            </label>
            {errors.cv && (
              <p className="text-xs text-destructive font-medium">
                {errors.cv.message as string}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" />
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="h-11 rounded-xl font-medium border-border/60 focus-visible:ring-primary/30"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive font-medium">{errors.phone.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              Cover Note
              <span className="text-[10px] font-normal text-muted-foreground ml-1">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Introduce yourself, highlight relevant experience, or ask questions…"
              rows={4}
              className="rounded-xl font-medium resize-none border-border/60 focus-visible:ring-primary/30"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-destructive font-medium">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl font-bold gap-2 bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⚙</span>
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Application
              </>
            )}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground/50 font-medium">
            By applying you agree to our terms of service.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
};
