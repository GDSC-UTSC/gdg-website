import { db } from "@/lib/firebase";
import { deleteProfileImage, uploadProfileImage } from "@/lib/storage";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export interface UserDataType {
  id: string;
  updatedAt: Date;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
}

export class UserData {
  id: string;
  updatedAt: Date;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  constructor(data: UserDataType) {
    this.id = data.id;
    this.updatedAt = new Date(data.updatedAt);
    this.profileImageUrl = data.profileImageUrl;
    this.bio = data.bio;
    this.linkedin = data.linkedin;
    this.github = data.github;
  }

  static converter = {
    toFirestore: (user: UserData) => {
      return {
        updatedAt: user.updatedAt.toISOString(),
        profileImageUrl: user.profileImageUrl,
        bio: user.bio,
        linkedin: user.linkedin,
        github: user.github,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new UserData({
        id: snapshot.id,
        updatedAt: data.updatedAt,
        profileImageUrl: data.profileImageUrl,
        bio: data.bio,
        linkedin: data.linkedin,
        github: data.github,
      });
    },
  };
  get isAdmin(): boolean {
    // check custom claims or we just query the db
    return false;
  }

  async create(): Promise<string> {
    await setDoc(
      doc(db, "users", this.id).withConverter(UserData.converter),
      this
    );
    return this.id;
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
    this.updatedAt = new Date();
    await updateDoc(
      doc(db, "users", this.id),
      UserData.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    await deleteDoc(doc(db, "users", this.id));
  }

  async uploadProfileImage(file: File): Promise<string> {
    const downloadURL = await uploadProfileImage(this.id, file);
    this.profileImageUrl = downloadURL;
    this.updatedAt = new Date();

    await updateDoc(doc(db, "users", this.id), {
      profileImageUrl: downloadURL,
      updatedAt: this.updatedAt.toISOString(),
    });

    return downloadURL;
  }

  async deleteProfileImage(): Promise<void> {
    if (!this.profileImageUrl) return;

    const urlParts = this.profileImageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1].split("?")[0];

    await deleteProfileImage(this.id, fileName);
    this.profileImageUrl = undefined;
    this.updatedAt = new Date();

    await updateDoc(doc(db, "users", this.id), {
      profileImageUrl: null,
      updatedAt: this.updatedAt.toISOString(),
    });
  }
}
