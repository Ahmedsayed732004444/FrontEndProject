import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetUserProfile,
  useUpdateBasicInfo,
  useUpdateProfilePicture,
  useUpdateCoverPicture,
  useUpdateCv,
  useDeleteProfilePicture,
  useDeleteCoverPicture,
  useDeleteCv,
} from "@/features/profile/hooks/useProfile";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { setFormErrors } from "@/lib/api/errors";
import type { BasicInfoRequest } from "@/features/profile/types/profile";
import { UserGender } from "@/features/profile/types/profile";

// Components
import { ProfilePhotoSection } from "@/features/profile/components/ProfilePhotoSection";
import { CvSection } from "@/features/profile/components/CvSection";
import { BasicInfoForm } from "@/features/profile/components/BasicInfoForm";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  yearsOfExperience: z.string().optional().or(z.literal("")),
  currentCompany: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  university: z.string().optional().or(z.literal("")),
  degree: z.string().optional().or(z.literal("")),
  graduationYear: z.string().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

function splitFullName(fullName: string | null | undefined) {
  if (!fullName) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return { firstName, lastName };
}

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetUserProfile();

  const updateBasicInfo = useUpdateBasicInfo();
  const updateProfilePicture = useUpdateProfilePicture();
  const updateCoverPicture = useUpdateCoverPicture();
  const updateCv = useUpdateCv();

  const deleteProfilePicture = useDeleteProfilePicture();
  const deleteCoverPicture = useDeleteCoverPicture();
  const deleteCv = useDeleteCv();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      country: "",
      city: "",
      jobTitle: "",
      yearsOfExperience: "",
      currentCompany: "",
      summary: "",
      university: "",
      degree: "",
      graduationYear: "",
      skills: [],
    },
  });

  React.useEffect(() => {
    if (!profile) return;

    const { firstName, lastName } = splitFullName(profile.fullName);

    profileForm.reset({
      firstName,
      lastName,
      gender: profile.gender === null ? "" : String(profile.gender),
      country: profile.country ?? "",
      city: profile.city ?? "",
      jobTitle: profile.jobTitle ?? "",
      yearsOfExperience:
        profile.yearsOfExperience === null
          ? ""
          : String(profile.yearsOfExperience),
      currentCompany: profile.currentCompany ?? "",
      summary: profile.summary ?? "",
      university: profile.university ?? "",
      degree: profile.degree ?? "",
      graduationYear:
        profile.graduationYear === null ? "" : String(profile.graduationYear),
      skills: profile.skills ?? [],
    });

    setPhotoPreview(profile.profilePictureUrl ?? null);
    setCoverPreview(profile.coverPictureUrl ?? null);
  }, [profile, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const payload: BasicInfoRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender:
          data.gender && data.gender.trim() !== ""
            ? (Number(data.gender) as UserGender)
            : undefined,
        country: data.country?.trim() ? data.country.trim() : undefined,
        city: data.city?.trim() ? data.city.trim() : undefined,
        jobTitle: data.jobTitle?.trim() ? data.jobTitle.trim() : undefined,
        yearsOfExperience: data.yearsOfExperience?.trim()
          ? Number(data.yearsOfExperience)
          : undefined,
        currentCompany: data.currentCompany?.trim()
          ? data.currentCompany.trim()
          : undefined,
        summary: data.summary?.trim() ? data.summary.trim() : undefined,
        university: data.university?.trim() ? data.university.trim() : undefined,
        degree: data.degree?.trim() ? data.degree.trim() : undefined,
        graduationYear: data.graduationYear?.trim()
          ? Number(data.graduationYear)
          : undefined,
        skills: data.skills,
      };

      await updateBasicInfo.mutateAsync(payload);
    } catch (error) {
      setFormErrors(error, profileForm.setError);
    }
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    try {
      await updateProfilePicture.mutateAsync(file);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleDeleteProfilePicture = async () => {
    try {
      await deleteProfilePicture.mutateAsync();
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  const handleCoverPictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    try {
      await updateCoverPicture.mutateAsync(file);
    } catch (error) {
      console.error("Error uploading cover picture:", error);
    }
  };

  const handleDeleteCoverPicture = async () => {
    try {
      await deleteCoverPicture.mutateAsync();
      setCoverPreview(null);
    } catch (error) {
      console.error("Error deleting cover picture:", error);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await updateCv.mutateAsync(file);
    } catch (error) {
      console.error("Error uploading CV:", error);
    }
  };

  const handleDeleteCv = async () => {
    try {
      await deleteCv.mutateAsync();
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  /* ── trigger the hidden form submit button ── */
  const handleSaveChanges = () => {
    const btn = document.getElementById(
      "basic-info-submit-btn"
    ) as HTMLButtonElement | null;
    btn?.click();
  };

  if (isLoading || !profile) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 lg:p-10">
        <Skeleton className="h-20 rounded-[2rem] mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[320px] rounded-[2.5rem]" />
            <Skeleton className="h-[240px] rounded-[2.5rem]" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-[600px] rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* ── Page Header ── */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 mb-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                 <span>Account</span>
                 <ChevronRight className="w-3 h-3" />
                 <span className="text-blue-600">Preferences</span>
               </div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                 Update <span className="text-blue-600">Profile</span>
               </h1>
               <p className="text-lg text-gray-500 font-medium">Manage your professional identity and assets.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate("/profile")}
                className="flex-1 sm:flex-none h-14 px-8 border-gray-100 bg-white text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all rounded-2xl"
              >
                Discard
              </Button>
            </div>
          </div>
        </div>

        {/* ── Content Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-start">
          {/* ── Left Column ── */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {/* Visual Assets */}
            <div className="space-y-6">
               <h2 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Visual Identity</h2>
               <ProfilePhotoSection
                  photoPreview={photoPreview}
                  coverPreview={coverPreview}
                  onUpload={handleProfilePictureUpload}
                  onDelete={handleDeleteProfilePicture}
                  isDeleting={deleteProfilePicture.isPending}
                  onCoverUpload={handleCoverPictureUpload}
                  onCoverDelete={handleDeleteCoverPicture}
                  isCoverDeleting={deleteCoverPicture.isPending}
                />
            </div>

            {/* Document Assets */}
            <div className="space-y-6">
               <h2 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Career Assets</h2>
               <CvSection
                  cvFileUrl={profile.cvFileUrl}
                  onUpload={handleCvUpload}
                  onDelete={handleDeleteCv}
                  isDeleting={deleteCv.isPending}
                />
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Core Information</h2>
            <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden p-2">
              <BasicInfoForm
                form={profileForm}
                onSubmit={onProfileSubmit}
                isSaving={updateBasicInfo.isPending}
              />
            </div>
          </div>
        </div>

        {/* ── Bottom Save Action ── */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            onClick={handleSaveChanges}
            disabled={updateBasicInfo.isPending}
            className={`
              h-16 px-16 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all shadow-xl
              ${updateBasicInfo.isPending ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 w-full sm:w-auto active:scale-[0.98]"}
            `}
          >
            {updateBasicInfo.isPending ? "Synchronizing..." : "Save Changes"}
          </Button>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest hidden sm:block">Changes reflect immediately</p>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
