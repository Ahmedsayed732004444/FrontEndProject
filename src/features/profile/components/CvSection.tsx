import React from "react";
import { FileText, CloudUpload, X, Download } from "lucide-react";
import { Label } from "@/shared/components/ui/label";

interface CvSectionProps {
  cvFileUrl: string | null | undefined;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const CvSection: React.FC<CvSectionProps> = ({
  cvFileUrl,
  onUpload,
  onDelete,
  isDeleting,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onUpload(syntheticEvent);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <FileText className="w-4 h-4 text-slate-700" aria-hidden="true" />
        <h3 className="text-[15px] font-bold text-slate-900">Resume / CV</h3>
      </div>
      <p className="text-[12.5px] text-slate-500 mb-4">
        Upload your latest resume for fast applications.
      </p>

      {/* Drag & drop zone */}
      <Label
        htmlFor="cv-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 gap-1.5 bg-slate-50/50 hover:bg-slate-50 ${
          isDragging ? "border-blue-500 bg-blue-50/30 shadow-inner" : "border-slate-200"
        }`}
      >
        <CloudUpload className="w-8 h-8 text-slate-400" aria-hidden="true" />
        <p className="text-[13px] font-semibold text-slate-700">
          Drag &amp; drop file
        </p>
        <p className="text-[12px] text-slate-400">or</p>
        <span className="text-[13px] font-bold text-blue-600 hover:underline">
          Browse Files
        </span>
        <p className="text-[11px] text-slate-400 mt-0.5">
          PDF, DOCX (Max 5MB)
        </p>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.docx,application/pdf"
          className="hidden"
          onChange={onUpload}
        />
      </Label>

      {/* Existing file */}
      {cvFileUrl && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm group">
          <div className="w-9 h-9 rounded-md bg-red-50 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-red-600" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">
              Resume.pdf
            </p>
            <p className="text-[11px] text-slate-500">
              Uploaded 2 days ago
            </p>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={cvFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="View CV"
              aria-label="View CV"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
            </a>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
              title="Remove CV"
              aria-label="Remove CV"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
