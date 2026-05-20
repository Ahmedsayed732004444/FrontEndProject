import React from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

interface CoverPhotoSectionProps {
  coverPreview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const CoverPhotoSection: React.FC<CoverPhotoSectionProps> = ({
  coverPreview,
  onUpload,
  onDelete,
  isDeleting,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Cover Picture</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-start gap-4">
        <div className="relative w-full">
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="w-full h-40 object-cover rounded-md" />
          ) : (
            <div className="w-full h-40 rounded-md bg-muted/40 flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="cover-upload" className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </span>
            </Button>
          </Label>
          <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={onUpload} />
          {coverPreview && (
            <Button variant="outline" size="sm" onClick={onDelete} disabled={isDeleting}>
              <X className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
