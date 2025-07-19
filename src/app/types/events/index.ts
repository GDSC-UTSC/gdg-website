import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { deleteFile, uploadFile } from "@/lib/firebase/client/storage";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export interface Organizer {
  userId: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  eventDate: Timestamp;
  startTime?: string;
  endTime?: string;
  location?: string;
  registrationDeadline?: Timestamp;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags?: string[];
  organizers?: Organizer[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;
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
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  tags?: string[];
  organizers?: Organizer[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;

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
      });
    },
  };

  // Computed properties
  get isUpcoming(): boolean {
    return this.status === "upcoming";
  }

  get isOngoing(): boolean {
    return this.status === "ongoing";
  }

  get isCompleted(): boolean {
    return this.status === "completed";
  }

  get isCancelled(): boolean {
    return this.status === "cancelled";
  }

  get isRegistrationOpen(): boolean {
    if (this.status !== "upcoming") return false;
    if (this.registrationDeadline) {
      return this.registrationDeadline.toDate() > new Date();
    }
    return this.eventDate.toDate() > new Date();
  }

  // Create a new event
  async create(): Promise<string> {
    const collectionPath = "events";
    this.id = await addDocument(collectionPath, this, Event.converter);
    return this.id;
  }

  // Read a single event by ID
  static async read(id: string): Promise<Event | null> {
    const documentPath = `events/${id}`;
    return await getDocument(documentPath, Event.converter);
  }

  // Read all events
  static async readAll(): Promise<Event[]> {
    const collectionPath = "events";
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
    const { downloadURL } = await uploadFile(
      file,
      `events/${this.id}/images/${file.name}`
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
  async updateStatus(
    newStatus: "upcoming" | "ongoing" | "completed" | "cancelled"
  ): Promise<void> {
    this.status = newStatus;
    await this.update();
  }
}
