import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface UserDataType {
  id: string;
  email: string;
  publicName?: string;
  updatedAt?: Timestamp;
  profileImageBase64?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  role?: UserRole;
}

export class UserData implements UserDataType {
  id: string;
  email: string;
  publicName?: string;
  updatedAt: Timestamp;
  profileImageBase64?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  role: UserRole;

  constructor(data: UserDataType) {
    this.id = data.id;
    this.email = data.email;
    this.publicName = data.publicName;
    this.updatedAt = data.updatedAt || (serverTimestamp() as Timestamp);
    this.profileImageBase64 = data.profileImageBase64;
    this.bio = data.bio;
    this.linkedin = data.linkedin;
    this.github = data.github;
    this.role = data.role || USER_ROLES.MEMBER; // Default to member if not specified
  }

  static converter = {
    toFirestore: (user: UserData) => {
      const data: any = {
        email: user.email,
        updatedAt: serverTimestamp(),
        role: user.role,
      };

      // Only include fields that are not undefined
      if (user.publicName !== undefined) data.publicName = user.publicName;
      if (user.profileImageBase64 !== undefined)
        data.profileImageBase64 = user.profileImageBase64;
      if (user.bio !== undefined) data.bio = user.bio;
      if (user.linkedin !== undefined) data.linkedin = user.linkedin;
      if (user.github !== undefined) data.github = user.github;

      return data;
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new UserData({
        id: snapshot.id,
        email: data.email,
        publicName: data.publicName,
        updatedAt: data.updatedAt,
        profileImageBase64: data.profileImageBase64,
        bio: data.bio,
        linkedin: data.linkedin,
        github: data.github,
        role: data.role,
      });
    },
  };

  get isAdmin(): boolean {
    return (
      this.role === USER_ROLES.ADMIN || this.role === USER_ROLES.SUPERADMIN
    );
  }

  get isSuperAdmin(): boolean {
    return this.role === USER_ROLES.SUPERADMIN;
  }

  get isMember(): boolean {
    return this.role === USER_ROLES.MEMBER;
  }

  async create(): Promise<string> {
    try {
      console.log(
        "UserData.create: Attempting to create user document for:",
        this.id
      );
      console.log("UserData.create: User data to be saved:", {
        id: this.id,
        email: this.email,
        publicName: this.publicName,
        profileImageBase64: this.profileImageBase64
          ? "Base64 data present"
          : "No profile image",
      });

      await setDoc(
        doc(db, "users", this.id).withConverter(UserData.converter),
        this
      );

      console.log(
        "UserData.create: Successfully created user document for:",
        this.id
      );
      return this.id;
    } catch (error) {
      console.error("UserData.create: Error creating user document:", error);
      console.error("UserData.create: Error details:", {
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : "No stack trace",
        userId: this.id,
        userEmail: this.email,
      });
      throw error; // Re-throw the error so it can be caught by the caller
    }
  }

  static async read(id: string): Promise<UserData | null> {
    const docSnap = await getDoc(
      doc(db, "users", id).withConverter(UserData.converter)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  static async readAll(): Promise<UserData[]> {
    const querySnapshot = await getDocs(
      collection(db, "users").withConverter(UserData.converter)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async update(): Promise<void> {
    await updateDoc(
      doc(db, "users", this.id),
      UserData.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    await deleteDoc(doc(db, "users", this.id));
  }

  /**
   * Converts a File to base64 string and saves it as the profile image
   * @param file - The image file to convert and save
   * @returns Promise<string> - The base64 string of the image
   */
  async uploadProfileImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const base64String = e.target?.result as string;
          this.profileImageBase64 = base64String;
          await this.update();
          resolve(base64String);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Removes the profile image by clearing the base64 data
   */
  async deleteProfileImage(): Promise<void> {
    this.profileImageBase64 = undefined;
    await this.update();
  }
}
