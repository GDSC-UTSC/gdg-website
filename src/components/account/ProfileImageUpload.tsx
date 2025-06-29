"use client";

import { FileUpload } from "@/components/ui/file-upload";

interface ProfileImageUploadProps {
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  isUploading: boolean;
}

export function ProfileImageUpload({ onFileSelect, onRemove, isUploading }: ProfileImageUploadProps) {
  return (
    <div className="pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Profile Image</h3>
      <FileUpload
        onFileSelect={onFileSelect}
        onRemove={onRemove}
        accept="image/*"
        maxSize={5}
        showPreview={false}
      />
      {isUploading && (
        <p className="text-sm text-gray-500 mt-2">Uploading...</p>
      )}
    </div>
  );
}