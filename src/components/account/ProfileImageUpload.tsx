"use client";

import { FileUpload } from "@/components/ui/file-upload";

interface ProfileImageUploadProps {
  onSubmit: (file: File) => void | Promise<void>;
  onRemove: () => void;
  isUploading: boolean;
}

export function ProfileImageUpload({ onSubmit, onRemove, isUploading }: ProfileImageUploadProps) {
  return (
    <div className="pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Profile Image</h3>
      <FileUpload
        onSubmit={onSubmit}
        onRemove={onRemove}
        accept="image/*"
        maxSize={5}
        showPreview={false}
        isSubmitting={isUploading}
        submitButtonText="Upload Image"
      />
      {isUploading && (
        <p className="text-sm text-gray-500 mt-2">Uploading...</p>
      )}
    </div>
  );
}