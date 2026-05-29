export interface GenerationInput {
  productName: string;
  productUrl?: string;
  category: ProductCategory;
  platforms: Platform[];
  audience: AudienceType;
  tone: ToneType;
  uniquePoint?: string;
}

export interface GenerationOutput {
  blueprint: Blueprint;
  angles: AnglePreview[];
  scripts: Script[];
  copywriting: Copywriting;
  timing: UploadTiming;
}

export interface Blueprint {
  targetAudience: string;
  painPoint: string;
  keyBenefit: string;
  recommendedAngles: AngleCode[];
}

export interface AnglePreview {
  code: AngleCode;
  name: string;
  hook: string;
  preview: string;
}

export interface Script {
  angleCode: AngleCode;
  hook: string;
  body: string;
  cta: string;
  estimatedDuration: string;
}

export interface Copywriting {
  captionShort: string;
  captionLong: string;
  hashtags: {
    trending: string[];
    niche: string[];
    product: string[];
  };
}

export interface UploadTiming {
  tiktok: string[];
  reels: string[];
  shopee: string[];
}

export interface GenerationDocument {
  id: string;
  productName: string;
  productUrl: string | null;
  category: ProductCategory;
  platforms: Platform[];
  audience: AudienceType;
  tone: ToneType;
  uniquePoint: string | null;
  output: GenerationOutput;
  createdAt: Date;
  status: "success" | "error";
}

export type ToneType = "formal" | "santai" | "genz";
export type AngleCode = "A1" | "A2" | "A3" | "A4" | "A5";
export type Platform = "tiktok" | "shopee" | "reels";

export type ProductCategory =
  | "skincare"
  | "fashion"
  | "elektronik"
  | "makanan"
  | "minuman"
  | "kesehatan"
  | "rumah_tangga"
  | "olahraga"
  | "otomotif"
  | "lainnya";

export type AudienceType =
  | "remaja_wanita"
  | "remaja_pria"
  | "dewasa_wanita"
  | "dewasa_pria"
  | "ibu_rumah_tangga"
  | "mahasiswa"
  | "pekerja_kantoran"
  | "umum";

// === Product Intelligence Types ===

export interface ProductIntelInput {
  title: string;               // Nama produk
  description: string;         // Deskripsi produk
  category: ProductCategory;   // Reuse existing
  price?: string;              // Cth: "Rp39.900"
  rating?: number;             // Cth: 4.8
  reviewKeywords?: string[];   // Cth: ["glowing", "murah", "ringan"]
  marketplace?: string;        // Cth: "Shopee", "TikTok Shop", "Tokopedia"
  productLink?: string;        // URL opsional
}

export interface ProductIntelOutput {
  productDNA: string;
  buyerPersona: string;
  corePainPoint: string;
  buyingTriggers: string;
  keyBenefits: string;
  objectionMapping: string;
  bestContentAngles: string;
  videoHooks: string;
  ctaStrategy: string;
  contentExecution: string;
}

export interface ProductIntelDocument {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: string | null;
  rating: number | null;
  reviewKeywords: string[];
  marketplace: string | null;
  productLink: string | null;
  output: ProductIntelOutput;
  createdAt: Date;
  status: "success" | "error";
  type: "product-intel"; // Untuk membedakan di Firestore dari generations biasa
}
