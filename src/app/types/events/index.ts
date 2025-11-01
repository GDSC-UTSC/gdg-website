import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { deleteFile, uploadFile } from "@/lib/firebase/client/storage";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export const EVENTSTATUS = ["test", "hidden", "default"] as const;

export type EventStatusType = (typeof EVENTSTATUS)[number];

export type QuestionType = {
  type: "text" | "textarea" | "select" | "checkbox" | "file";
  label: string;
  options?: string[]; // For select and checkbox types
  required?: boolean;
};

export type CheckedInUser = {
  uid: string;
  name: string;
  checkInTime: Timestamp;
};

export interface EventType {
  id: string;
  title: string;
  description: string;
  eventDate: Timestamp;
  startTime?: string;
  endTime?: string;
  location?: string;
  registrationDeadline?: Timestamp;
  status: EventStatusType;
  tags?: string[];
  organizers?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;
  questions?: QuestionType[];
  checkedInUsers?: CheckedInUser[];
}

export class Event implements EventType {
  id: string;
  title: string;
  description: string;
  eventDate: Timestamp;
  startTime?: string;
  endTime?: string;
  location?: string;
  registrationDeadline?: Timestamp;
  status: EventStatusType;
  tags?: string[];
  organizers?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;
  questions?: QuestionType[];
  checkedInUsers?: CheckedInUser[];

  constructor(data: EventType) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.eventDate = data.eventDate;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.location = data.location;
    this.registrationDeadline = data.registrationDeadline;
    this.status = data.status;
    this.tags = data.tags;
    this.organizers = data.organizers;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
    this.imageUrls = data.imageUrls;
    this.link = data.link;
    this.questions = data.questions || [];
    this.checkedInUsers = data.checkedInUsers || [];
  }

  static converter = {
    toFirestore: (event: Event) => {
      return {
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        registrationDeadline: event.registrationDeadline,
        status: event.status,
        tags: event.tags,
        organizers: event.organizers,
        createdAt: event.createdAt,
        updatedAt: serverTimestamp(),
        imageUrls: event.imageUrls,
        link: event.link,
        questions: event.questions,
        checkedInUsers: event.checkedInUsers || [],
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Event({
        id: snapshot.id,
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        registrationDeadline: data.registrationDeadline,
        status: data.status,
        tags: data.tags,
        organizers: data.organizers,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        imageUrls: data.imageUrls,
        link: data.link,
        questions: data.questions || [],
        checkedInUsers: data.checkedInUsers || [],
      });
    },
  };

  // Computed properties
  get isUpcoming(): boolean {
    if (this.status !== "default") return false;

    const now = new Date();
    const eventDateTime = this.getEventStartDateTime();

    return eventDateTime > now;
  }

  get isOngoing(): boolean {
    if (this.status !== "default") return false;

    const now = new Date();
    const startDateTime = this.getEventStartDateTime();
    const endDateTime = this.getEventEndDateTime();

    return now >= startDateTime && now <= endDateTime;
  }

  get isPast(): boolean {
    if (this.status !== "default") return false;

    const now = new Date();
    const endDateTime = this.getEventEndDateTime();

    return now > endDateTime;
  }

  private getEventStartDateTime(): Date {
    const eventDate = this.eventDate.toDate();
    if (this.startTime) {
      const [hours, minutes] = this.startTime.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    }
    return eventDate;
  }

  private getEventEndDateTime(): Date {
    const eventDate = this.eventDate.toDate();
    if (this.endTime) {
      const [hours, minutes] = this.endTime.split(":").map(Number);
      eventDate.setHours(hours, minutes, 0, 0);
    } else if (this.startTime) {
      // If no end time, assume 1 hour duration
      const [hours, minutes] = this.startTime.split(":").map(Number);
      eventDate.setHours(hours + 1, minutes, 0, 0);
    } else {
      // If no times specified, assume end of day
      eventDate.setHours(23, 59, 59, 999);
    }
    return eventDate;
  }

  get isRegistrationOpen(): boolean {
    if (this.status === "test") return false;
    if (this.registrationDeadline) {
      return this.registrationDeadline.toDate() > new Date();
    }
    return this.getEventStartDateTime() > new Date();
  }

  get isPublic(): boolean {
    return this.status !== "hidden" && this.status !== "test";
  }

  get displayStatus(): string {
    if (this.status !== "default") return this.status;

    if (this.isUpcoming) return "upcoming";
    if (this.isOngoing) return "ongoing";
    if (this.isPast) return "past";

    return "default";
  }

  // Create a new event
  async create(): Promise<string> {
    const collectionPath = "events";
    this.id = await addDocument(collectionPath, this, Event.converter);
    return this.id;
  }

  // Read a single event by ID
  static async read(id: string, options?: { server?: boolean }): Promise<Event | null> {
    const documentPath = `events/${id}`;

    if (options?.server) {
      ("use server");
      const { getDocument: getDocumentServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentServer(documentPath, Event.converter);
    }

    return await getDocument(documentPath, Event.converter);
  }

  // Read all events
  static async readAll(options?: { server?: boolean; public?: boolean }): Promise<Event[]> {
    const collectionPath = "events";

    if (options?.server) {
      ("use server");
      const { getDocuments: getDocumentsServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentsServer(collectionPath, Event.converter, { public: options?.public || false });
    }

    return await getDocuments(collectionPath, Event.converter);
  }

  // Update event
  async update(): Promise<void> {
    const documentPath = `events/${this.id}`;
    await updateDocument(documentPath, Event.converter.toFirestore(this));
  }

  // Delete event
  async delete(): Promise<void> {
    if (this.imageUrls && this.imageUrls.length > 0) {
      await this.deleteAllImages();
    }

    const documentPath = `events/${this.id}`;
    await deleteDocument(documentPath);
  }

  // Image management methods
  async uploadImage(file: File): Promise<string> {
    const { downloadURL } = await uploadFile(file, `events/${this.id}/images/${file.name}`);

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
      await deleteFile(`events/${this.id}/images`);
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
      await deleteFile(`events/${this.id}/images`);
      this.imageUrls = [];
      await this.update();
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  }

  // Event-specific methods
  async updateStatus(status: EventStatusType): Promise<void> {
    this.status = status;
    await this.update();
  }
}
