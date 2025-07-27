import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export type TeamMember = {
  userId: string;
  position: string; // e.g., "Co-Lead", "Vice Lead", "Director", etc.
};

export type TeamType = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[]; // Array of team members with positions
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export class Team implements TeamType {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Timestamp;
  updatedAt: Timestamp;

  constructor(data: TeamType) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.members = data.members || [];
    this.createdAt = data.createdAt || (serverTimestamp() as Timestamp);
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
  }

  static converter = {
    toFirestore: (team: Team) => {
      return {
        name: team.name,
        description: team.description,
        members: team.members,
        createdAt: team.createdAt,
        updatedAt: serverTimestamp(),
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Team({
        id: snapshot.id,
        name: data.name,
        description: data.description,
        members: data.members || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    },
  };

  async create(): Promise<string> {
    const collectionPath = "teams";
    this.id = await addDocument(collectionPath, this, Team.converter);
    return this.id;
  }

  static async read(id: string, options?: { server?: boolean }): Promise<Team | null> {
    const documentPath = `teams/${id}`;

    if (options?.server) {
      "use server";
      const { getDocument: getDocumentServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentServer(documentPath, Team.converter);
    }

    return await getDocument(documentPath, Team.converter);
  }

  static async readAll(options?: { server?: boolean, public?: boolean }): Promise<Team[]> {
    const collectionPath = "teams";

    if (options?.server) {
      "use server";
      const { getDocuments: getDocumentsServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentsServer(collectionPath, Team.converter, { public: options?.public || false });
    }

    return await getDocuments(collectionPath, Team.converter);
  }


  async update(): Promise<void> {
    const documentPath = `teams/${this.id.toString()}`;
    await updateDocument(documentPath, Team.converter.toFirestore(this));
  }

  async delete(): Promise<void> {
    const documentPath = `teams/${this.id.toString()}`;
    await deleteDocument(documentPath);
  }

  // Helper methods for managing team members
  addMember(userId: string, position: string): void {
    // Check if user is already a member
    const existingMemberIndex = this.members.findIndex(m => m.userId === userId);
    if (existingMemberIndex >= 0) {
      // Update existing member
      this.members[existingMemberIndex] = { userId, position };
    } else {
      // Add new member
      this.members.push({ userId, position });
    }
  }

  removeMember(userId: string): boolean {
    const initialLength = this.members.length;
    this.members = this.members.filter(m => m.userId !== userId);
    return this.members.length < initialLength;
  }

  updateMemberPosition(userId: string, position: string): boolean {
    const member = this.members.find(m => m.userId === userId);
    if (member) {
      member.position = position;
      return true;
    }
    return false;
  }

  getMember(userId: string): TeamMember | undefined {
    return this.members.find(m => m.userId === userId);
  }

  getSortedMembers(): TeamMember[] {
    return [...this.members];
  }
}
