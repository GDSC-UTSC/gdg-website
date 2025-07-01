import { db } from "@/lib/firebase";
import { deleteFile, uploadFile } from "@/lib/storage";
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

export interface UserDataType {
  id: string;
  publicName?: string;
  updatedAt: Timestamp;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
}

export class UserData {
  id: string;
  publicName?: string;
  updatedAt: Timestamp;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  constructor(data: UserDataType) {
    this.id = data.id;
    this.publicName = data.publicName;
    this.updatedAt = data.updatedAt || serverTimestamp() as Timestamp;
    this.profileImageUrl = data.profileImageUrl;
    this.bio = data.bio;
    this.linkedin = data.linkedin;
    this.github = data.github;
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
    await updateDoc(
      doc(db, "users", this.id),
      UserData.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    await deleteDoc(doc(db, "users", this.id));
  }

  async uploadProfileImage(file: File): Promise<string> {
    if (this.profileImageUrl) {
      // If there's an existing profile image, delete it first
      await this.deleteProfileImage();
    }
    const { downloadURL } = await uploadFile(
      file,
      `users/${this.id}/profile/image`
    );
    this.profileImageUrl = downloadURL;
    await this.update();

    return downloadURL;
  }

  async deleteProfileImage(): Promise<void> {
    if (!this.profileImageUrl) return;

    await deleteFile(`users/${this.id}/profile/image`);
    this.profileImageUrl = undefined;

    await this.update();
  }
}
