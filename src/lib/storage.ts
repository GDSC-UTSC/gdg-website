import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./firebase";

// Upload a file to Firebase Storage
export async function uploadFile(
  file: File,
  path: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
) {
  try {
    // Validate file exists
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate path
    if (!path || path.trim() === "") {
      throw new Error("Invalid storage path");
    }

    const storageRef = ref(storage, path);

    // Prepare metadata
    const uploadMetadata = {
      contentType: metadata?.contentType || file.type,
      customMetadata: {
        originalName: file.name,
        fileSize: file.size.toString(),
        uploadedAt: new Date().toISOString(),
        ...metadata?.customMetadata,
      },
    };

    const snapshot = await uploadBytes(storageRef, file, uploadMetadata);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      downloadURL,
      metadata: snapshot.metadata,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error("Error uploading file:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("storage/unauthorized")) {
        throw new Error("Upload failed: Unauthorized access");
      } else if (error.message.includes("storage/quota-exceeded")) {
        throw new Error("Upload failed: Storage quota exceeded");
      } else if (error.message.includes("storage/retry-limit-exceeded")) {
        throw new Error("Upload failed: Network error, please try again");
      } else if (error.message.includes("storage/invalid-format")) {
        throw new Error("Upload failed: Invalid file format");
      }
    }

    throw new Error("Upload failed: Please try again later");
  }
}

// Get download URL for a file
export async function getFileURL(path: string) {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
}

// Delete a file from Firebase Storage
export async function deleteFile(path: string) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// List all files in a directory
export async function listFiles(directory: string) {
  try {
    const storageRef = ref(storage, directory);
    const result = await listAll(storageRef);
    return result.items.map((item) => item.fullPath);
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}
