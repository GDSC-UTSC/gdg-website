import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  getDocumentsWithQuery,
  updateDocument,
} from "@/lib/firestore";
import {
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export type RegistrationStatus = "registered" | "waitlist" | "cancelled";
export type AttendanceStatus = "pending" | "attended" | "no_show";

export interface EventRegistrationType {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: Timestamp;
  status: RegistrationStatus;
  attendanceStatus: AttendanceStatus;
  notes?: string;
}

export class EventRegistration implements EventRegistrationType {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: Timestamp;
  status: RegistrationStatus;
  attendanceStatus: AttendanceStatus;
  notes?: string;

  constructor(data: EventRegistrationType) {
    this.id = data.id;
    this.eventId = data.eventId;
    this.userId = data.userId;
    this.registrationDate = data.registrationDate || (serverTimestamp() as Timestamp);
    this.status = data.status;
    this.attendanceStatus = data.attendanceStatus || "pending";
    this.notes = data.notes;
  }

  static converter = {
    toFirestore: (registration: EventRegistration) => {
      const data: any = {
        eventId: registration.eventId,
        userId: registration.userId,
        registrationDate: registration.registrationDate,
        status: registration.status,
        attendanceStatus: registration.attendanceStatus,
      };
      
      // Only include notes if it's not undefined
      if (registration.notes !== undefined) {
        data.notes = registration.notes;
      }
      
      return data;
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new EventRegistration({
        id: snapshot.id,
        eventId: data.eventId,
        userId: data.userId,
        registrationDate: data.registrationDate,
        status: data.status,
        attendanceStatus: data.attendanceStatus || "pending",
        notes: data.notes,
      });
    },
  };

  get isActive(): boolean {
    return this.status === "registered";
  }

  get isWaitlisted(): boolean {
    return this.status === "waitlist";
  }

  get isCancelled(): boolean {
    return this.status === "cancelled";
  }

  get hasAttended(): boolean {
    return this.attendanceStatus === "attended";
  }

  async create(): Promise<string> {
    const collectionPath = "event_registrations";
    this.id = await addDocument(collectionPath, this, EventRegistration.converter);
    return this.id;
  }

  static async read(id: string): Promise<EventRegistration | null> {
    const documentPath = `event_registrations/${id}`;
    return await getDocument(documentPath, EventRegistration.converter);
  }

  static async readAll(): Promise<EventRegistration[]> {
    const collectionPath = "event_registrations";
    return await getDocuments(collectionPath, EventRegistration.converter);
  }

  static async getByEventId(eventId: string): Promise<EventRegistration[]> {
    const collectionPath = "event_registrations";
    return await getDocumentsWithQuery(
      collectionPath,
      "eventId",
      "==",
      eventId,
      EventRegistration.converter
    );
  }

  static async getByUserId(userId: string): Promise<EventRegistration[]> {
    const collectionPath = "event_registrations";
    return await getDocumentsWithQuery(
      collectionPath,
      "userId",
      "==",
      userId,
      EventRegistration.converter
    );
  }

  static async getByEventAndUser(eventId: string, userId: string): Promise<EventRegistration | null> {
    const collectionPath = "event_registrations";
    const registrations = await getDocumentsWithQuery(
      collectionPath,
      "eventId",
      "==",
      eventId,
      EventRegistration.converter
    );
    
    return registrations.find(registration => registration.userId === userId) || null;
  }

  static async getActiveRegistrationsByEventId(eventId: string): Promise<EventRegistration[]> {
    const allRegistrations = await EventRegistration.getByEventId(eventId);
    return allRegistrations.filter(registration => registration.isActive);
  }

  async update(): Promise<void> {
    const documentPath = `event_registrations/${this.id}`;
    await updateDocument(documentPath, EventRegistration.converter.toFirestore(this));
  }

  async updateStatus(newStatus: RegistrationStatus): Promise<void> {
    this.status = newStatus;
    await this.update();
  }

  async updateAttendanceStatus(newAttendanceStatus: AttendanceStatus): Promise<void> {
    this.attendanceStatus = newAttendanceStatus;
    await this.update();
  }

  async delete(): Promise<void> {
    const documentPath = `event_registrations/${this.id}`;
    await deleteDocument(documentPath);
  }

  static async createRegistration(eventId: string, userId: string, status: RegistrationStatus = "registered"): Promise<EventRegistration> {
    const existingRegistration = await EventRegistration.getByEventAndUser(eventId, userId);
    
    if (existingRegistration) {
      throw new Error("User is already registered for this event");
    }

    const registration = new EventRegistration({
      id: "",
      eventId,
      userId,
      registrationDate: serverTimestamp() as Timestamp,
      status,
      attendanceStatus: "pending",
    });

    await registration.create();
    return registration;
  }

  static async cancelRegistration(eventId: string, userId: string): Promise<void> {
    const registration = await EventRegistration.getByEventAndUser(eventId, userId);
    
    if (!registration) {
      throw new Error("No registration found for this user and event");
    }

    await registration.updateStatus("cancelled");
  }

  static async getRegistrationCount(eventId: string): Promise<number> {
    const activeRegistrations = await EventRegistration.getActiveRegistrationsByEventId(eventId);
    return activeRegistrations.length;
  }
}