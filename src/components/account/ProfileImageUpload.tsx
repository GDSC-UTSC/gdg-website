"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { AnimatePresence, motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useState } from "react";

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
      console.error("Upload failed:", error);
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

        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full"
                >
                  <motion.div
                    animate={isUploading ? { rotate: 360 } : { rotate: 0 }}
                    transition={
                      isUploading
                        ? { duration: 1, repeat: Infinity, ease: "linear" }
                        : {}
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                  </motion.div>
                  {isUploading ? "Uploading..." : "Upload Profile Image"}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
