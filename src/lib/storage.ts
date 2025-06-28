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

// Upload user profile image
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    // Create a reference to the profile image in the user's directory
    const storageRef = ref(storage, `users/${userId}/profile/${file.name}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const getProfileImageURL = async (
  userId: string,
  fileName: string
): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error getting profile image URL:", error);
    return null;
  }
};

export const deleteProfileImage = async (
  userId: string,
  fileName: string
): Promise<void> => {
  try {
    const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting profile image:", error);
    throw error;
  }
};

// Upload event image
export async function uploadEventImage(eventId: string, file: File) {
  const path = `events/${eventId}/event-image.${file.name.split(".").pop()}`;
  return uploadFile(file, path, {
    contentType: file.type,
    customMetadata: {
      eventId,
      uploadedAt: new Date().toISOString(),
    },
  });
}
