"use client";
// TODO: add multiple file support
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  previewUrl?: string;
  showPreview?: boolean;
}

export function FileUpload({
  onFileSelect,
  onRemove,
  accept = "image/*",
  maxSize = 5,
  className,
  previewUrl,
  showPreview = true,
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
    onFileSelect(file);

    // Create preview for images
    if (showPreview && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Select File
        </Button>
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
            className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors bg-white border border-gray-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {selectedFile && !showPreview && (
        <div className="relative p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
