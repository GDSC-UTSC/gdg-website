"use client";

import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadFile } from "@/lib/firebase/client/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase/client/index";
import { toast } from "sonner";

interface ImageUploadProps {
  storagePath: string;
  firestorePath: string;
  onUploadComplete?: (urls: string[]) => void;
}

export function ImageUpload({
  storagePath,
  firestorePath,
  onUploadComplete,
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      // Upload all files to Firebase Storage
      for (const file of selectedFiles) {
        const fileName = `${Date.now()}_${file.name}`;
        const fullStoragePath = `${storagePath}/${fileName}`;
        
        const result = await uploadFile(file, fullStoragePath);
        uploadedUrls.push(result.downloadURL);
      }
      
      // Update Firestore with the new image URLs
      const docRef = doc(db, firestorePath);
      await updateDoc(docRef, {
        imageUrls: arrayUnion(...uploadedUrls),
        updatedAt: new Date()
      });
      
      toast.success(`Successfully uploaded ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}!`);
      setSelectedFiles([]); // Clear files after successful upload
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(uploadedUrls);
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
      // Keep files selected on error so user can retry
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-medium mb-4">Images</h3>
      <div className="space-y-4">
        <FileUpload
          files={selectedFiles}
          setFiles={setSelectedFiles}
          accept="image/*"
          maxSize={5}
          showPreview={true}
          multiple={true}
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
                    transition={isUploading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                  </motion.div>
                  {isUploading 
                    ? "Uploading..." 
                    : `Upload ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`
                  }
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}