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
  eventName?: string; // Optional for convenience
  userId: string;
  userName?: string; // Optional for convenience
  registrationDate: Timestamp;
  status: RegistrationStatus;
  attendanceStatus: AttendanceStatus;
  notes?: string;
}

export class EventRegistration implements EventRegistrationType {
  id: string;
  eventId: string;
  eventName?: string; // Optional for convenience
  userId: string;
  userName?: string; // Optional for convenience
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
        // Include eventName and userName if they are provided
        ...(registration.eventName ? {eventName: registration.eventName}: {}),
        ...(registration.userName ? {userName: registration.userName} : {}),
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
        eventName: data.eventName,
        userId: data.userId,
        userName: data.userName,
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

  // Create a new registration in Firestore
  async create(): Promise<string> {
    const collectionPath = "event_registrations";
    this.id = await addDocument<EventRegistration>(collectionPath, this, EventRegistration.converter);
    return this.id;
  }

  // Read a single registration by ID
  static async read(id: string): Promise<EventRegistration | null> {
    const documentPath = `event_registrations/${id}`;
    return await getDocument<EventRegistration>(documentPath, EventRegistration.converter);
  }

  // Read all registrations
  static async readAll(): Promise<EventRegistration[]> {
    const collectionPath = "event_registrations";
    return await getDocuments<EventRegistration>(collectionPath, EventRegistration.converter);
  }

  // Read registrations with a specific query
  static async getByEventId(eventId: string): Promise<EventRegistration[]> {
    const collectionPath = "event_registrations";
    return await getDocumentsWithQuery<EventRegistration>(
      collectionPath,
      "eventId",
      "==",
      eventId,
      EventRegistration.converter
    );
  }

  // Read registrations by user ID
  static async getByUserId(userId: string): Promise<EventRegistration[]> {
    const collectionPath = "event_registrations";
    return await getDocumentsWithQuery<EventRegistration>(
      collectionPath,
      "userId",
      "==",
      userId,
      EventRegistration.converter
    );
  }

  // Read a specific registration by event ID and user ID
  static async getByEventAndUser(eventId: string, userId: string): Promise<EventRegistration | null> {
    const collectionPath = "event_registrations";
    const registrations = await getDocumentsWithQuery<EventRegistration>(
      collectionPath,
      "eventId",
      "==",
      eventId,
      EventRegistration.converter
    );

    return registrations.find(registration => registration.userId === userId) || null;
  }

  // Get active registrations for a specific event
  static async getActiveRegistrationsByEventId(eventId: string): Promise<EventRegistration[]> {
    const allRegistrations = await EventRegistration.getByEventId(eventId);
    return allRegistrations.filter(registration => registration.isActive);
  }

  // Get waitlisted registrations for a specific event (ordered by registration date)
  static async getWaitlistRegistrationsByEventId(eventId: string): Promise<EventRegistration[]> {
    const allRegistrations = await EventRegistration.getByEventId(eventId);
    return allRegistrations
      .filter(registration => registration.isWaitlisted)
      .sort((a, b) => a.registrationDate.toMillis() - b.registrationDate.toMillis());
  }

  // Get next user in waitlist for a specific event
  static async getNextInWaitlist(eventId: string): Promise<EventRegistration | null> {
    const waitlistRegistrations = await EventRegistration.getWaitlistRegistrationsByEventId(eventId);
    return waitlistRegistrations.length > 0 ? waitlistRegistrations[0] : null;
  }

  // Promote a user from waitlist to registered
  static async promoteFromWaitlist(eventId: string): Promise<EventRegistration | null> {
    const nextInWaitlist = await EventRegistration.getNextInWaitlist(eventId);

    if (!nextInWaitlist) {
      return null;
    }

    await nextInWaitlist.updateStatus("registered");
    return nextInWaitlist;
  }

  // Get user's position in waitlist (1-based)
  static async getWaitlistPosition(eventId: string, userId: string): Promise<number | null> {
    const waitlistRegistrations = await EventRegistration.getWaitlistRegistrationsByEventId(eventId);
    const position = waitlistRegistrations.findIndex(reg => reg.userId === userId);
    return position === -1 ? null : position + 1;
  }

  async update(): Promise<void> {
    const documentPath = `event_registrations/${this.id}`;
    await updateDocument<EventRegistration>(documentPath, EventRegistration.converter.toFirestore(this));
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

  static async createRegistration(eventId: string, userId: string, status: RegistrationStatus = "registered"): Promise<{registration: EventRegistration, waitlistPosition?: number}> {
    const existingRegistration = await EventRegistration.getByEventAndUser(eventId, userId);

    if (existingRegistration) {
      throw new Error("User is already registered for this event");
    }

    // Calculate waitlist position BEFORE creating registration
    let waitlistPosition: number | undefined;
    if (status === "waitlist") {
      const currentWaitlist = await EventRegistration.getWaitlistRegistrationsByEventId(eventId);
      waitlistPosition = currentWaitlist.length + 1; // Next position in line
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
    return { registration, waitlistPosition };
  }

  static async cancelRegistration(eventId: string, userId: string): Promise<void> {
    const registration = await EventRegistration.getByEventAndUser(eventId, userId);

    if (!registration) {
      throw new Error("No registration found for this user and event");
    }

    const wasActive = registration.isActive;
    
    // Delete the registration document completely
    await registration.delete();
    
    // If user was registered (not waitlisted), promote next person from waitlist
    if (wasActive) {
      await EventRegistration.promoteFromWaitlist(eventId);
    }
  }

  // Get count of registered users only
  static async getRegisteredCount(eventId: string): Promise<number> {
    const activeRegistrations = await EventRegistration.getActiveRegistrationsByEventId(eventId);
    return activeRegistrations.length;
  }

  // Get count of waitlisted users only
  static async getWaitlistCount(eventId: string): Promise<number> {
    const waitlistRegistrations = await EventRegistration.getWaitlistRegistrationsByEventId(eventId);
    return waitlistRegistrations.length;
  }

  // Get total count (registered + waitlisted) for capacity management
  static async getTotalRegistrationCount(eventId: string): Promise<number> {
    const registered = await EventRegistration.getRegisteredCount(eventId);
    const waitlisted = await EventRegistration.getWaitlistCount(eventId);
    return registered + waitlisted;
  }

  // Keep legacy method for backward compatibility
  static async getRegistrationCount(eventId: string): Promise<number> {
    return await EventRegistration.getRegisteredCount(eventId);
  }
}
