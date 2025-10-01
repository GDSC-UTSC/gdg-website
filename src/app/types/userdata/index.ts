import {
  deleteDocument,
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
} from "@/lib/firebase/client/firestore";
import { deleteFile, uploadFile } from "@/lib/firebase/client/storage";
import { serverTimestamp, Timestamp } from "firebase/firestore";

export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type Role = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface UserDataType {
  id: string;
  publicName?: string;
  updatedAt: Timestamp;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  role?: Role;
  associations?: {
    applications?: string[]; // position ids
    registrations?: string[]; // event ids
    collaborations?: string[]; // project ids
  };
}

export class UserData implements UserDataType {
  id: string;
  publicName?: string;
  updatedAt: Timestamp;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  role: Role;
  associations?: {
    applications?: string[];
    registrations?: string[];
    collaborations?: string[];
  };
  constructor(data: UserDataType) {
    this.id = data.id;
    this.publicName = data.publicName;
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
    this.profileImageUrl = data.profileImageUrl;
    this.bio = data.bio;
    this.linkedin = data.linkedin;
    this.github = data.github;
    this.role = data.role || "member";
    this.associations = data.associations || {
      applications: [],
      registrations: [],
      collaborations: [],
    };
  }

  static converter = {
    toFirestore: (user: UserData) => {
      return {
        publicName: user.publicName,
        updatedAt: serverTimestamp(),
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        linkedin: user.linkedin,
        github: user.github,
        role: user.role,
        associations: user.associations || {
          applications: [],
          registrations: [],
          collaborations: [],
        },
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new UserData({
        id: snapshot.id,
        publicName: data.publicName,
        updatedAt: data.updatedAt,
        profileImageUrl: data.profileImageUrl,
        bio: data.bio,
        linkedin: data.linkedin,
        github: data.github,
        role: data.role || "member",
        associations: data.associations || {
          applications: [],
          registrations: [],
          collaborations: [],
        },
      });
    },
  };

  get isAdmin(): boolean {
    return this.role === "admin" || this.role === "superadmin";
  }

  get isSuperAdmin(): boolean {
    return this.role === "superadmin";
  }

  async create(): Promise<string> {
    const documentPath = `users/${this.id}`;
    await setDocument(documentPath, this, UserData.converter);
    return this.id;
  }

  static async read(id: string, options?: { server?: boolean; public?: boolean }): Promise<UserData | null> {
    const documentPath = `users/${id}`;

    if (options?.server) {
      ("use server");
      const { getDocument: getDocumentServer } = await import("@/lib/firebase/server/firestore");
      return await getDocumentServer(documentPath, UserData.converter, { public: options?.public });
    }
    return await getDocument(documentPath, UserData.converter);
  }

  static async readAll(options?: { server?: boolean; public?: boolean }): Promise<UserData[]> {
    const collectionPath = "users";

    if (options?.server) {
      ("use server");
      const { getDocuments: getDocumentsServer, getDocumentsWithQuery: getDocumentsWithQueryServer } = await import(
        "@/lib/firebase/server/firestore"
      );
      if (options?.public) {
        return await getDocumentsWithQueryServer(collectionPath, "role", "!=", "member", UserData.converter, {
          public: true,
        });
      }
      return await getDocumentsServer(collectionPath, UserData.converter);
    }

    return await getDocuments(collectionPath, UserData.converter);
  }

  async update(): Promise<void> {
    const documentPath = `users/${this.id}`;
    await updateDocument(documentPath, UserData.converter.toFirestore(this));
  }

  async delete(): Promise<void> {
    const documentPath = `users/${this.id}`;
    await deleteDocument(documentPath);
  }

  async uploadProfileImage(file: File): Promise<string> {
    try {
      if (this.profileImageUrl) {
        await this.deleteProfileImage();
      }
    } catch (error) {
      console.error("Error deleting existing profile image:", error);
    } finally {
      const { downloadURL } = await uploadFile(file, `users/${this.id}/profile/image`);
      this.profileImageUrl = downloadURL;
      await this.update();

      return downloadURL;
    }
  }

  async deleteProfileImage(): Promise<void> {
    if (!this.profileImageUrl) return;

    await deleteFile(`users/${this.id}/profile/image`);
    this.profileImageUrl = undefined;

    await this.update();
  }
}
