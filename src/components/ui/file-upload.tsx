"use client";
// TODO: add multiple file support
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./button";

interface FileUploadProps {
  onSubmit: (file: File) => void | Promise<void>;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  previewUrl?: string;
  showPreview?: boolean;
  isSubmitting?: boolean;
  submitButtonText?: string;
  clearOnSubmit?: boolean;
}

export function FileUpload({
  onSubmit,
  onRemove,
  accept = "image/*",
  maxSize = 5,
  className,
  previewUrl,
  showPreview = true,
  isSubmitting = false,
  submitButtonText = "Upload",
  clearOnSubmit = true,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (showPreview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      await onSubmit(selectedFile);
      if (clearOnSubmit) {
        // Clear the selected file and preview after successful submission
        setSelectedFile(null);
        setPreview(previewUrl || null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      // Don't clear on error - let the user retry
      console.error("Upload failed:", error);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
        >
          <Upload className="w-4 h-4 mr-2" />
          Select File
        </Button>
        {selectedFile && (
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Uploading..." : submitButtonText}
          </Button>
        )}
      </div>

      {/* Image Preview */}
      {showPreview && preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {selectedFile && !showPreview && (
        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-card">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-muted rounded flex items-center justify-center">
              <Upload className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="flex-shrink-0 hover:bg-red-50 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
