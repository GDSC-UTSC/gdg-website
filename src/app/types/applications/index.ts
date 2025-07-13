import {
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
} from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export type ApplicationType = {
  id: string;
  name: string;
  email: string;
  questions: Record<string, string>;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class Application implements ApplicationType {
  id: string;
  name: string;
  email: string;
  questions: Record<string, string>;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;

  constructor(data: ApplicationType) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.questions = data.questions;
    this.status = data.status;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
  }

  static converter = {
    toFirestore: (application: Application) => {
      return {
        name: application.name,
        email: application.email,
        questions: application.questions,
        status: application.status,
        createdAt: application.createdAt,
        updatedAt: serverTimestamp(),
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Application({
        id: snapshot.id,
        name: data.name,
        email: data.email,
        questions: data.questions,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
  };

  async create(positionId: string): Promise<string> {
    const documentPath = `positions/${positionId}/applications/${this.id}`;
    await setDocument(documentPath, this, Application.converter);
    return this.id;
  }

  static async read(
    positionId: string,
    userId: string
  ): Promise<Application | null> {
    const documentPath = `positions/${positionId}/applications/${userId}`;
    return await getDocument(documentPath, Application.converter);
  }

  static async readAll(positionId: string): Promise<Application[]> {
    const collectionPath = `positions/${positionId}/applications`;
    return await getDocuments(collectionPath, Application.converter);
  }

  async update(positionId: string): Promise<void> {
    const documentPath = `positions/${positionId}/applications/${this.id}`;
    const converter = Application.converter;
    await updateDocument(documentPath, converter.toFirestore(this));
  }

  async updateStatus(
    positionId: string,
    status: "pending" | "accepted" | "rejected"
  ): Promise<void> {
    this.status = status;
    await this.update(positionId);
  }

  async delete() {
    // should not be able to delete ANY application for historical reasons
    return;
  }

  async uploadFile(
    file: File,
    positionId: string,
    userId: string,
    filename: string
  ): Promise<string> {
    const filePath = `positions/${positionId}/applications/${userId}/${filename}`;
    const { downloadURL } = await uploadFile(file, filePath);

    return downloadURL;
  }
}
