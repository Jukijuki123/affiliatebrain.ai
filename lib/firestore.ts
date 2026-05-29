import { db } from "./firebase";
import { collection, getDocs, query, orderBy, limit, doc, deleteDoc } from "firebase/firestore";
import { GenerationDocument, ProductIntelDocument } from "./types";

// Client-side: use client SDK to read (called from browser components)
export async function getGenerations(uid: string): Promise<GenerationDocument[]> {
  const generationsRef = collection(db, "users", uid, "generations");
  const q = query(generationsRef, orderBy("createdAt", "desc"), limit(10));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as GenerationDocument[];
}

export async function deleteGeneration(uid: string, id: string): Promise<void> {
  const docRef = doc(db, "users", uid, "generations", id);
  await deleteDoc(docRef);
}

export async function getProductIntels(uid: string): Promise<ProductIntelDocument[]> {
  const intelRef = collection(db, "users", uid, "product-intel");
  const q = query(intelRef, orderBy("createdAt", "desc"), limit(10));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as ProductIntelDocument[];
}

export async function deleteProductIntel(uid: string, id: string): Promise<void> {
  const docRef = doc(db, "users", uid, "product-intel", id);
  await deleteDoc(docRef);
}

