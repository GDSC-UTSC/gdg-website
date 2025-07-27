import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  getDocumentsWithQuery,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export type PositionType = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "active" | "inactive";
  questions: QuestionType[];
};

export type QuestionType = {
  type: "text" | "textarea" | "select" | "checkbox" | "file";
  label: string;
  options?: string[]; // For select and checkbox types
  required?: boolean;
};

export class Position implements PositionType {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "active" | "inactive";
  questions: QuestionType[];

  constructor(data: PositionType) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
    this.status = data.status;
    this.questions = data.questions || [];
  }
  static converter = {
    toFirestore: (position: Position) => {
      return {
        name: position.name,
        description: position.description,
        tags: position.tags,
        createdAt: position.createdAt,
        updatedAt: serverTimestamp(),
        status: position.status,
        questions: position.questions,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Position({
        id: snapshot.id,
        name: data.name,
        description: data.description,
        tags: data.tags,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status,
        questions: data.questions || [],
      });
    },
  };
  get isActive(): boolean {
    return this.status === "active";
  }
  get isDraft(): boolean {
    return this.status === "draft";
  }

  async create(): Promise<string> {
    const collectionPath = "positions";
    this.id = await addDocument(collectionPath, this, Position.converter);
    return this.id;
  }

  static async read(id: string, options?: { server?: boolean, public?: boolean }): Promise<Position | null> {
    const documentPath = `positions/${id}`;

    if (options?.server) {
      ("use server");
      const { getDocument: getDocumentServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentServer(documentPath, Position.converter, { public: options?.public || false });
    }

    return await getDocument(documentPath, Position.converter);
  }

  static async readAll(options?: { server?: boolean, public?: boolean }): Promise<Position[]> {
    const collectionPath = "positions";

    if (options?.server) {
      ("use server");
      const { getDocuments: getDocumentsServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentsServer(collectionPath, Position.converter, { public: options?.public || false });
    }

    return await getDocuments(collectionPath, Position.converter);
  }

  static async readAllActive(options?: { server?: boolean, public?: boolean }): Promise<Position[]> {
    const collectionPath = "positions";

    if (options?.server) {
      ("use server");
      const { getDocumentsWithQuery: getDocumentsWithQueryServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentsWithQueryServer(collectionPath, "status", "==", "active", Position.converter, { public: options?.public || false });
    }

    return await getDocumentsWithQuery(
      collectionPath,
      "status",
      "==",
      "active",
      Position.converter
    );
  }
  async update(): Promise<void> {
    const documentPath = `positions/${this.id.toString()}`;
    await updateDocument(documentPath, Position.converter.toFirestore(this));
  }

  async delete(): Promise<void> {
    const documentPath = `positions/${this.id.toString()}`;
    await deleteDocument(documentPath);
  }
}
