import { db } from "@/lib/firebase";
import { uploadFile } from "@/lib/storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export type ApplicationType = {
  id: string;
  name: string;
  email: string;
  quesitons: Record<string, string>;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class Application implements ApplicationType {
  id: string;
  name: string;
  email: string;
  quesitons: Record<string, string>;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;

  constructor(data: ApplicationType) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.quesitons = data.quesitons;
    this.status = data.status;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
  }

  static converter = {
    toFirestore: (application: Application) => {
      return {
        name: application.name,
        email: application.email,
        quesitons: application.quesitons,
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
        quesitons: data.quesitons,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
  };

  async create(positionId: string): Promise<string> {
    const docRef = doc(db, "positions", positionId, "applications", this.id);
    await setDoc(docRef.withConverter(Application.converter), this);
    return this.id;
  }

  static async read(
    positionId: string,
    userId: string
  ): Promise<Application | null> {
    const docSnap = await getDoc(
      doc(db, "positions", positionId, "applications", userId).withConverter(
        Application.converter
      )
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  static async readAll(positionId: string): Promise<Application[]> {
    const querySnapshot = await getDocs(
      collection(db, "positions", positionId, "applications").withConverter(
        Application.converter
      )
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async update(): Promise<void> {
    const converter = Application.converter;
    await updateDoc(
      doc(db, "positions", this.id, "applications", this.id),
      converter.toFirestore(this)
    );
  }

  async updateStatus(
    status: "pending" | "accepted" | "rejected"
  ): Promise<void> {
    this.status = status;
    await this.update();
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
