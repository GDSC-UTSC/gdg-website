"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Upload } from "lucide-react";

interface ProfileImageUploadProps {
  onUpload: (file: File) => void | Promise<void>;
  isUploading: boolean;
}

export function ProfileImageUpload({
  onUpload,
  isUploading,
}: ProfileImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      await onUpload(selectedFiles[0]); // Only upload the first file for profile image
      setSelectedFiles([]); // Clear files after successful upload
    } catch (error) {
      // Keep files selected on error so user can retry
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="pt-6 border-t">
      <h3 className="text-lg font-medium mb-4">Profile Image</h3>
      <div className="space-y-4">
        <FileUpload
          files={selectedFiles}
          setFiles={setSelectedFiles}
          accept="image/*"
          maxSize={5}
          showPreview={true}
          multiple={false}
        />
        
        {selectedFiles.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Profile Image"}
          </Button>
        )}
      </div>
    </div>
  );
}
