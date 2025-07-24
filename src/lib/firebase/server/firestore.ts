"use server";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import { getAuthenticatedFirestore } from "./index";

// Type for Firestore converters
export interface FirestoreConverter<T> {
  toFirestore: (data: T) => any;
  fromFirestore: (snapshot: any, options: any) => T;
}

// Add a new document to a collection (generates ID automatically)
export async function addDocument<T>(
  collectionPath: string,
  data: T,
  converter: FirestoreConverter<T>
): Promise<string> {
  try {
    const db = await getAuthenticatedFirestore();
    const docRef = await addDoc(
      collection(db, collectionPath).withConverter(converter),
      data
    );
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionPath}:`, error);
    throw error;
  }
}

// Set a document with a specific ID
export async function setDocument<T>(
  documentPath: string,
  data: T,
  converter: FirestoreConverter<T>
): Promise<string> {
  try {
    const db = await getAuthenticatedFirestore();
    const docRef = doc(db, documentPath).withConverter(converter);
    await setDoc(docRef, data);
    return docRef.id;
  } catch (error) {
    console.error(`Error setting document at ${documentPath}:`, error);
    throw error;
  }
}

// Get a single document by path
export async function getDocument<T>(
  documentPath: string,
  converter: FirestoreConverter<T>
): Promise<T | null> {
  try {
    const db = await getAuthenticatedFirestore();
    const docSnap = await getDoc(
      doc(db, documentPath).withConverter(converter)
    );
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${documentPath}:`, error);
    throw error;
  }
}

// Get all documents from a collection
export async function getDocuments<T>(
  collectionPath: string,
  converter: FirestoreConverter<T>
): Promise<T[]> {
  try {
    const db = await getAuthenticatedFirestore();
    const querySnapshot = await getDocs(
      collection(db, collectionPath).withConverter(converter)
    );
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(`Error getting documents from ${collectionPath}:`, error);
    throw error;
  }
}

// Get documents with a where query
export async function getDocumentsWithQuery<T>(
  collectionPath: string,
  field: string,
  operator: WhereFilterOp,
  value: any,
  converter: FirestoreConverter<T>
): Promise<T[]> {
  try {
    const db = await getAuthenticatedFirestore();
    const querySnapshot = await getDocs(
      query(
        collection(db, collectionPath).withConverter(converter),
        where(field, operator, value)
      )
    );
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(`Error querying documents from ${collectionPath}:`, error);
    throw error;
  }
}

// Update a document
export async function updateDocument<T>(
  documentPath: string,
  data: any
): Promise<void> {
  try {
    const db = await getAuthenticatedFirestore();
    await updateDoc(doc(db, documentPath), data);
  } catch (error) {
    console.error(`Error updating document at ${documentPath}:`, error);
    throw error;
  }
}

// Delete a document
export async function deleteDocument(documentPath: string): Promise<void> {
  try {
    const db = await getAuthenticatedFirestore();
    await deleteDoc(doc(db, documentPath));
  } catch (error) {
    console.error(`Error deleting document at ${documentPath}:`, error);
    throw error;
  }
}