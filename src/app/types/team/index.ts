import {
  deleteDocument,
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";

// Define team categories
export const TEAMS = {
  EXECUTIVE: "Co-Leads",
  TECH: "Tech Team",
  MARKETING: "Marketing Team",
  OPERATIONS: "Operations Team",
  EVENTS: "Events Team",
  FINANCE: "Finance Team",
  ACADEMICS: "Academics Team",
} as const;

export type Team = (typeof TEAMS)[keyof typeof TEAMS];

// Define roles within each team
export const ROLES = {
  // Executive roles
  PRESIDENT: "Co-Lead",

  // Team roles (can be applied to any team)
  VICE_LEADER: "Vice Lead",
  DIRECTOR: "Director",
  ASSOCIATE: "Associate",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface TeamAssignmentType {
  id: string;
  userId: string;
  team: Team;
  role: Role;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export class TeamAssignment implements TeamAssignmentType {
  id: string;
  userId: string;
  team: Team;
  role: Role;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  constructor(data: TeamAssignmentType) {
    this.id = data.id;
    this.userId = data.userId;
    this.team = data.team;
    this.role = data.role;
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
  }

  static converter = {
    toFirestore: (assignment: TeamAssignment) => {
      return {
        userId: assignment.userId,
        team: assignment.team,
        role: assignment.role,
        createdAt: assignment.createdAt,
        updatedAt: serverTimestamp(),
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new TeamAssignment({
        id: snapshot.id,
        userId: data.userId,
        team: data.team,
        role: data.role,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
  };

  async create(): Promise<string> {
    const documentPath = `team_assignments/${this.id}`;
    await setDocument(documentPath, this, TeamAssignment.converter);
    return this.id;
  }

  static async read(
    id: string,
    options?: { server?: boolean }
  ): Promise<TeamAssignment | null> {
    const documentPath = `team_assignments/${id}`;

    if (options?.server) {
      ("use server");
      const { getDocument: getDocumentServer } = await import(
        "@/lib/firebase/server/firestore"
      );
      return await getDocumentServer(documentPath, TeamAssignment.converter);
    }

    return await getDocument(documentPath, TeamAssignment.converter);
  }

  static async readAll(options?: {
    server?: boolean;
  }): Promise<TeamAssignment[]> {
    const collectionPath = "team_assignments";

    if (options?.server) {
      ("use server");
      const { getDocuments: getDocumentsServer } = await import(
        "@/lib/firebase/server/firestore"
      );
      return await getDocumentsServer(collectionPath, TeamAssignment.converter);
    }

    return await getDocuments(collectionPath, TeamAssignment.converter);
  }

  static async readByUser(userId: string): Promise<TeamAssignment[]> {
    const collectionPath = "team_assignments";
    const assignments = await getDocuments(
      collectionPath,
      TeamAssignment.converter
    );
    return assignments.filter((assignment) => assignment.userId === userId);
  }

  static async readByRole(role: Role): Promise<TeamAssignment[]> {
    const collectionPath = "team_assignments";
    const assignments = await getDocuments(
      collectionPath,
      TeamAssignment.converter
    );
    return assignments.filter((assignment) => assignment.role === role);
  }

  async update(): Promise<void> {
    const documentPath = `team_assignments/${this.id}`;
    await updateDocument(
      documentPath,
      TeamAssignment.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    const documentPath = `team_assignments/${this.id}`;
    await deleteDocument(documentPath);
  }
}
