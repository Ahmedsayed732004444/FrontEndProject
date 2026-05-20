import React from "react";
import { User, Upload, X, Image } from "lucide-react";
import { Label } from "@/shared/components/ui/label";

interface ProfilePhotoSectionProps {
  photoPreview: string | null;
  coverPreview?: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  isDeleting: boolean;
  onCoverUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverDelete?: () => void;
  isCoverDeleting?: boolean;
}

export const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({
  photoPreview,
  coverPreview,
  onUpload,
  onDelete,
  isDeleting,
  onCoverUpload,
  onCoverDelete,
  isCoverDeleting,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    {/* Cover area */}
    <div className="relative">
      <div
        className={`w-full h-32 sm:h-40 ${
          !coverPreview ? "bg-gradient-to-br from-slate-800 via-blue-600 to-blue-400" : ""
        }`}
      >
        {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile avatar overlapping cover */}
      <div className="absolute left-1/2 lg:left-6 bottom-0 translate-y-1/2 -translate-x-1/2 lg:translate-x-0 w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-md">
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <User className="w-8 h-8" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Cover edit button */}
      {onCoverUpload && (
        <Label
          htmlFor="cover-upload-combined"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white transition-colors shadow-sm"
        >
          <Image className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <input
            id="cover-upload-combined"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onCoverUpload}
          />
        </Label>
      )}
    </div>

    {/* Body */}
    <div className="pt-14 pb-5 px-5 lg:pt-16">
      <h3 className="text-[15px] font-bold text-slate-900 mb-1">
        Profile &amp; Media
      </h3>
      <p className="text-[12.5px] text-slate-500 mb-4">
        Update your profile and cover photos to stand out.
      </p>

      <div className="flex flex-col gap-2">
        {/* Upload new photo */}
        <Label
          htmlFor="photo-upload"
          className="flex items-center justify-center gap-1.5 h-9 px-4 text-[13px] font-bold text-blue-600 border border-blue-100 rounded-lg bg-blue-50/50 cursor-pointer hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          Upload Photo
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </Label>

        {/* Remove current */}
        {photoPreview && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1.5 h-8 text-[12px] font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            {isDeleting ? "Removing..." : "Remove Profile"}
          </button>
        )}

        {/* Cover remove */}
        {coverPreview && onCoverDelete && (
          <button
            onClick={onCoverDelete}
            disabled={isCoverDeleting}
            className="flex items-center justify-center gap-1.5 h-8 text-[12px] font-semibold text-slate-400 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
            {isCoverDeleting ? "Removing..." : "Remove Cover"}
          </button>
        )}
      </div>
    </div>
  </div>
);
