import { db, storage } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export interface Contributor {
  name: string;
  initial: string;
  color: string;
}

export interface ProjectType {
  id?: string;
  title: string;
  description: string;
  languages: string[];
  link: string;
  color: string;
  contributors?: Contributor[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string; // User ID who created the project
  imageUrl?: string;
}

export class ProjectDB implements ProjectType {
  id?: string;
  title: string;
  description: string;
  languages: string[];
  link: string;
  color: string;
  contributors?: Contributor[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
  imageUrl?: string;

  constructor(data: ProjectType) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.languages = data.languages;
    this.link = data.link;
    this.color = data.color;
    this.contributors = data.contributors || [];
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.imageUrl = data.imageUrl;
  }

  static converter = {
    toFirestore: (project: ProjectDB) => {
      const data: any = {
        title: project.title,
        description: project.description,
        languages: project.languages,
        link: project.link,
        color: project.color,
        contributors: project.contributors || [],
        updatedAt: serverTimestamp(),
      };

      // Only add createdAt if it doesn't exist (for new projects)
      if (!project.createdAt) {
        data.createdAt = serverTimestamp();
      }

      // Only add createdBy if it's defined
      if (project.createdBy) {
        data.createdBy = project.createdBy;
      }

      // Only add imageUrl if it's defined
      if (project.imageUrl) {
        data.imageUrl = project.imageUrl;
      }

      return data;
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new ProjectDB({
        id: snapshot.id,
        title: data.title,
        description: data.description,
        languages: data.languages,
        link: data.link,
        color: data.color,
        contributors: data.contributors,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy,
        imageUrl: data.imageUrl,
      });
    },
  };

  // Create a new project
  async create(): Promise<string> {
    const docRef = await addDoc(
      collection(db, "projects").withConverter(ProjectDB.converter),
      this
    );
    this.id = docRef.id;
    return this.id;
  }

  // Read a single project by ID
  static async read(id: string): Promise<ProjectDB | null> {
    const docSnap = await getDoc(
      doc(db, "projects", id).withConverter(ProjectDB.converter)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  // Read all projects
  static async readAll(): Promise<ProjectDB[]> {
    const querySnapshot = await getDocs(
      collection(db, "projects").withConverter(ProjectDB.converter)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  // Update an existing project
  async update(): Promise<void> {
    if (!this.id) {
      throw new Error("Cannot update project without ID");
    }
    this.updatedAt = serverTimestamp() as Timestamp;

    await updateDoc(
      doc(db, "projects", this.id),
      ProjectDB.converter.toFirestore(this)
    );
  }

  // Delete a project
  async delete(): Promise<void> {
    if (!this.id) {
      throw new Error("Cannot delete project without ID");
    }

    // Delete associated image if it exists
    if (this.imageUrl) {
      await this.deleteImage();
    }

    await deleteDoc(doc(db, "projects", this.id));
  }

  // Upload image to Firebase Storage
  async uploadImage(file: File): Promise<string> {
    if (!this.id) {
      throw new Error("Project must be saved before uploading image");
    }

    const imageRef = ref(storage, `projects/${this.id}/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update the project with the new image URL
    this.imageUrl = downloadURL;
    await this.update();

    return downloadURL;
  }

  // Delete image from Firebase Storage
  async deleteImage(): Promise<void> {
    if (!this.imageUrl) {
      return;
    }

    try {
      const imageRef = ref(storage, this.imageUrl);
      await deleteObject(imageRef);

      // Update the project to remove the image URL
      this.imageUrl = undefined;
      await this.update();
    } catch (error) {
      console.error("Error deleting image:", error);
      // Continue even if image deletion fails
    }
  }

  // Convert to plain object for local state management
  toPlainObject(): ProjectType {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      languages: this.languages,
      link: this.link,
      color: this.color,
      contributors: this.contributors,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      imageUrl: this.imageUrl,
    };
  }
}
