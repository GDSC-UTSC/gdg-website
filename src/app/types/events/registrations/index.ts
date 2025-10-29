import { getDocument, getDocuments, setDocument, updateDocument } from "@/lib/firebase/client/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export type RegistrationType = {
  id: string;
  name: string;
  email: string;
  questions: Record<string, string>;
  status: "registered" | "cancelled";
  checkIn: boolean;
  checkInTime?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class Registration implements RegistrationType {
  id: string;
  name: string;
  email: string;
  questions: Record<string, string>;
  status: "registered" | "cancelled";
  checkIn: boolean;
  checkInTime?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  constructor(data: RegistrationType) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.questions = data.questions;
    this.status = data.status;
    this.checkIn = data.checkIn || false;
    this.checkInTime = data.checkInTime;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
  }

  static converter = {
    toFirestore: (registration: Registration) => {
      return {
        name: registration.name,
        email: registration.email,
        questions: registration.questions,
        status: registration.status,
        checkIn: registration.checkIn,
        checkInTime: registration.checkInTime,
        createdAt: registration.createdAt,
        updatedAt: serverTimestamp(),
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Registration({
        id: snapshot.id,
        name: data.name,
        email: data.email,
        questions: data.questions,
        status: data.status,
        checkIn: data.checkIn || false,
        checkInTime: data.checkInTime,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
  };

  async create(eventId: string): Promise<string> {
    const documentPath = `events/${eventId}/registrations/${this.id}`;
    await setDocument(documentPath, this, Registration.converter);
    return this.id;
  }

  static async read(eventId: string, userId: string, options?: { server?: boolean }): Promise<Registration | null> {
    const documentPath = `events/${eventId}/registrations/${userId}`;

    if (options?.server) {
      ("use server");
      const { getDocument: getDocumentServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentServer(documentPath, Registration.converter);
    }

    return await getDocument(documentPath, Registration.converter);
  }

  static async readAll(eventId: string, options?: { server?: boolean }): Promise<Registration[]> {
    const collectionPath = `events/${eventId}/registrations`;

    if (options?.server) {
      ("use server");
      const { getDocuments: getDocumentsServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentsServer(collectionPath, Registration.converter);
    }

    return await getDocuments(collectionPath, Registration.converter);
  }

  async update(eventId: string): Promise<void> {
    const documentPath = `events/${eventId}/registrations/${this.id}`;
    const converter = Registration.converter;
    await updateDocument(documentPath, converter.toFirestore(this));
  }

  async updateStatus(eventId: string, status: "registered" | "cancelled"): Promise<void> {
    this.status = status;
    await this.update(eventId);
  }

  async delete() {
    // should not be able to delete ANY registration for historical reasons
    return;
  }

  // Computed properties
  get isRegistered(): boolean {
    return this.status === "registered";
  }

  get isCancelled(): boolean {
    return this.status === "cancelled";
  }

  get isCheckedIn(): boolean {
    return this.checkIn === true;
  }
}
