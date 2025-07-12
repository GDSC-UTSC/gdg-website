import { db } from "@/lib/firebase";
import { deleteFile, uploadFile } from "@/lib/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

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
    const docRef = await addDoc(
      collection(db, "projects").withConverter(Project.converter),
      this
    );
    this.id = docRef.id;
    return this.id;
  }

  // Read a single project by ID
  static async read(id: string): Promise<Project | null> {
    const docSnap = await getDoc(
      doc(db, "projects", id).withConverter(Project.converter)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  // Read all projects
  static async readAll(): Promise<Project[]> {
    const querySnapshot = await getDocs(
      collection(db, "projects").withConverter(Project.converter)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async update(): Promise<void> {
    await updateDoc(
      doc(db, "projects", this.id),
      Project.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    if (this.imageUrls && this.imageUrls.length > 0) {
      await this.deleteAllImages();
    }

    await deleteDoc(doc(db, "projects", this.id));
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
