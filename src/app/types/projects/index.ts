import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { deleteFile, uploadFile } from "@/lib/firebase/client/storage";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export interface Contributor {
  userId: string;
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  languages?: string[];
  contributors?: Contributor[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;
}

export class Project implements ProjectType {
  id: string;
  title: string;
  description: string;
  languages?: string[];
  contributors?: Contributor[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;

  constructor(data: ProjectType) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.languages = data.languages;
    this.contributors = data.contributors;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
    this.imageUrls = data.imageUrls;
    this.link = data.link;
  }

  static converter = {
    toFirestore: (project: Project) => {
      return {
        title: project.title,
        description: project.description,
        languages: project.languages,
        contributors: project.contributors,
        createdAt: project.createdAt,
        updatedAt: serverTimestamp(),
        imageUrls: project.imageUrls,
        link: project.link,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Project({
        id: snapshot.id,
        title: data.title,
        description: data.description,
        languages: data.languages,
        contributors: data.contributors,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        imageUrls: data.imageUrls,
        link: data.link,
      });
    },
  };

  // Create a new project
  async create(): Promise<string> {
    const collectionPath = "projects";
    this.id = await addDocument(collectionPath, this, Project.converter);
    return this.id;
  }

  // Read a single project by ID
  static async read(id: string, options?: { server?: boolean, public?: boolean }): Promise<Project | null> {
    const documentPath = `projects/${id}`;

    if (options?.server) {
      "use server";
      const { getDocument: getDocumentServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentServer(documentPath, Project.converter, { public: options?.public || false });
    }

    return await getDocument(documentPath, Project.converter);
  }

  // Read all projects
  static async readAll(options?: { server?: boolean, public?: boolean }): Promise<Project[]> {
    const collectionPath = "projects";

    if (options?.server) {
      "use server";
      const { getDocuments: getDocumentsServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentsServer(collectionPath, Project.converter, { public: options?.public || false });
    }

    return await getDocuments(collectionPath, Project.converter);
  }

  async update(): Promise<void> {
    const documentPath = `projects/${this.id}`;
    await updateDocument(documentPath, Project.converter.toFirestore(this));
  }

  async delete(): Promise<void> {
    if (this.imageUrls && this.imageUrls.length > 0) {
      await this.deleteAllImages();
    }

    const documentPath = `projects/${this.id}`;
    await deleteDocument(documentPath);
  }

  async uploadImage(file: File): Promise<string> {
    const { downloadURL } = await uploadFile(
      file,
      `projects/${this.id}/images/${file.name}`
    );

    if (!this.imageUrls) {
      this.imageUrls = [];
    }
    this.imageUrls.push(downloadURL);
    await this.update();

    return downloadURL;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    if (!this.imageUrls || !this.imageUrls.includes(imageUrl)) {
      return;
    }

    try {
      await deleteFile(`projects/${this.id}/images`);
      this.imageUrls = this.imageUrls.filter((url) => url !== imageUrl);
      await this.update();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  async deleteAllImages(): Promise<void> {
    if (!this.imageUrls || this.imageUrls.length === 0) {
      return;
    }

    try {
      await deleteFile(`projects/${this.id}/images`);
      this.imageUrls = [];
      await this.update();
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  }
}
