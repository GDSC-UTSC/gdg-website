import { db } from "@/lib/firebase";
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

export type PositionType = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "active" | "inactive";
  questions?: QuestionType[];
};

export type QuestionType = {
  type: "text" | "textarea" | "select" | "checkbox" | "file";
  label: string;
  options?: string[]; // For select and checkbox types
  required?: boolean;
};

export class Position {
  id: number;
  name: string;
  description: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "active" | "inactive";

  constructor(data: PositionType) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
    this.status = data.status;
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
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Position({
        id: parseInt(snapshot.id),
        name: data.name,
        description: data.description,
        tags: data.tags,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status,
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
    const docRef = await addDoc(
      collection(db, "positions").withConverter(Position.converter),
      this
    );
    this.id = parseInt(docRef.id);
    return docRef.id;
  }

  static async read(id: string): Promise<Position | null> {
    const docSnap = await getDoc(
      doc(db, "positions", id).withConverter(Position.converter)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  static async readAll(): Promise<Position[]> {
    const querySnapshot = await getDocs(
      collection(db, "positions").withConverter(Position.converter)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async update(): Promise<void> {
    await updateDoc(
      doc(db, "positions", this.id.toString()),
      Position.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    await deleteDoc(doc(db, "positions", this.id.toString()));
  }
}
