import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { GenerationInput, GenerationOutput, ProductIntelInput, ProductIntelOutput } from "./types";

// Server-side ONLY: called from API routes, never imported in client components
export async function saveGeneration(
  uid: string,
  input: GenerationInput,
  output: GenerationOutput
): Promise<string> {
  const generationsRef = adminDb
    .collection("users")
    .doc(uid)
    .collection("generations");

  const docRef = await generationsRef.add({
    productName: input.productName,
    productUrl: input.productUrl || null,
    category: input.category,
    platforms: input.platforms,
    audience: input.audience,
    tone: input.tone,
    uniquePoint: input.uniquePoint || null,
    output: output,
    createdAt: FieldValue.serverTimestamp(),
    status: "success",
  });

  return docRef.id;
}

export async function saveProductIntel(
  uid: string,
  input: ProductIntelInput,
  output: ProductIntelOutput
): Promise<string> {
  const intelRef = adminDb
    .collection("users")
    .doc(uid)
    .collection("product-intel");

  const docRef = await intelRef.add({
    title: input.title,
    description: input.description,
    category: input.category,
    price: input.price || null,
    rating: input.rating || null,
    reviewKeywords: input.reviewKeywords || [],
    marketplace: input.marketplace || null,
    productLink: input.productLink || null,
    output: output,
    createdAt: FieldValue.serverTimestamp(),
    status: "success",
    type: "product-intel",
  });

  return docRef.id;
}

