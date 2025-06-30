export type PositionType = {
  id: number;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  status: "draft" | "active" | "inactive";
};

export class Position {
  id: number;
  name: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "active" | "inactive";

  constructor(data: PositionType) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
    this.status = data.status;
  }
  static converter = {
    toFirestore: (position: Position) => {
      return {
        name: position.name,
        description: position.description,
        tags: position.tags,
        createdAt: position.createdAt.toISOString(),
        updatedAt: position.updatedAt.toISOString(),
        status: position.status,
      };
    },
    fromFirestore: (snapshot: any, options: any) => {
      const data = snapshot.data(options);
      return new Position({
        id: parseInt(snapshot.id),
        name: data.name,
        description: data.description,
        tags: data.tags,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status,
      });
    },
  };
  get isActive(): boolean {
    return this.status === "active";
  }
  get isDraft(): boolean {
    return this.status === "draft";
  }

  async create(): Promise<string> {
    const { addDoc, collection } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    const docRef = await addDoc(
      collection(db, "positions").withConverter(Position.converter),
      this
    );
    this.id = parseInt(docRef.id);
    return docRef.id;
  }

  static async read(id: string): Promise<Position | null> {
    const { doc, getDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    const docSnap = await getDoc(
      doc(db, "positions", id).withConverter(Position.converter)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  }

  static async readAll(): Promise<Position[]> {
    const { collection, getDocs } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    const querySnapshot = await getDocs(
      collection(db, "positions").withConverter(Position.converter)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async update(): Promise<void> {
    const { doc, updateDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    this.updatedAt = new Date();
    await updateDoc(
      doc(db, "positions", this.id.toString()),
      Position.converter.toFirestore(this)
    );
  }

  async delete(): Promise<void> {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    await deleteDoc(doc(db, "positions", this.id.toString()));
  }
}
