"use client";
import { useState } from "react";
import { ProductIntelInput, ProductCategory } from "@/lib/types";
import CategorySelect from "./CategorySelect";
import ReviewKeywordsInput from "./ReviewKeywordsInput";
import MarketplaceSelect from "./MarketplaceSelect";

interface ProductIntelFormProps {
  onSubmit: (data: ProductIntelInput) => void;
  isGenerating: boolean;
}

export default function ProductIntelForm({ onSubmit, isGenerating }: ProductIntelFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProductCategory | "">("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [reviewKeywords, setReviewKeywords] = useState<string[]>([]);
  const [marketplace, setMarketplace] = useState("");
  const [productLink, setProductLink] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      return setError("Nama produk wajib diisi");
    }
    if (!description.trim()) {
      return setError("Deskripsi produk wajib diisi");
    }
    if (!category) {
      return setError("Kategori wajib dipilih");
    }

    onSubmit({
      title,
      description,
      category: category as ProductCategory,
      price: price.trim() || undefined,
      rating,
      reviewKeywords: reviewKeywords.length > 0 ? reviewKeywords : undefined,
      marketplace: marketplace || undefined,
      productLink: productLink.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,103,125,0.04)] border border-gray-100 flex flex-col gap-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-['Inter'] flex gap-2 border border-red-100">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Product Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-800 font-['Montserrat'] flex items-center gap-1">
          Nama Produk <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 font-['Inter'] -mt-1">Tulis nama brand dan model produk secara spesifik.</p>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cth: Serum Vitamin C Somethinc"
            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/15 focus:border-[var(--color-brand-teal)] text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all min-h-[44px]"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-800 font-['Montserrat'] flex items-center gap-1">
          Deskripsi Produk <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 font-['Inter'] -mt-1">Berikan rincian singkat mengenai produk, klaim utama, atau kandungan penting.</p>
        <div className="relative mt-1">
          <div className="absolute top-3 left-4 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tulis deskripsi atau selling point utama di sini agar AI dapat menyusun analisis yang tepat..."
            className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/15 focus:border-[var(--color-brand-teal)] text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all min-h-[100px] font-['Inter']"
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-800 font-['Montserrat'] flex items-center gap-1">
          Kategori Produk <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 font-['Inter'] -mt-1">Pilih kategori yang paling sesuai untuk optimasi strategi.</p>
        <div className="mt-1">
          <CategorySelect value={category} onChange={setCategory} />
        </div>
      </div>

      <div className="border-t border-dashed border-gray-100 my-2" />

      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider -mb-2">Informasi Tambahan (Sangat Direkomendasikan)</h3>

      {/* Price & Rating (Grid layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800 font-['Montserrat']">
            Harga Produk
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <span className="text-sm font-semibold">Rp</span>
            </div>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Cth: Rp39.900 atau 150rb"
              className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/15 focus:border-[var(--color-brand-teal)] text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all min-h-[44px]"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800 font-['Montserrat']">
            Rating Produk
          </label>
          <div className="relative mt-1 flex gap-3 items-center">
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={rating || 4.5}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full accent-[var(--color-brand-teal)] h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-extrabold text-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/10 px-3 py-1.5 rounded-xl border border-[var(--color-brand-teal)]/20 shrink-0 font-sans">
              ⭐️ {rating !== undefined ? rating.toFixed(1) : "Pilih"}
            </span>
          </div>
        </div>
      </div>

      {/* Review Keywords */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-800 font-['Montserrat']">
          Review Keywords / Kata Kunci Pembeli
        </label>
        <p className="text-xs text-gray-400 font-['Inter'] -mt-1">Masukkan kata kunci ulasan pembeli yang sering muncul.</p>
        <div className="mt-1">
          <ReviewKeywordsInput value={reviewKeywords} onChange={setReviewKeywords} />
        </div>
      </div>

      {/* Marketplace & Product Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marketplace */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800 font-['Montserrat']">
            Marketplace Asal
          </label>
          <div className="mt-1">
            <MarketplaceSelect value={marketplace} onChange={setMarketplace} />
          </div>
        </div>

        {/* Link Produk */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-800 font-['Montserrat']">
            Link Toko / Produk (URL)
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <input
              type="url"
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              placeholder="Cth: https://shopee.co.id/..."
              className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/15 focus:border-[var(--color-brand-teal)] text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all min-h-[44px]"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-[var(--color-brand-teal)] hover:bg-[#004d5e] text-white py-4 rounded-xl font-bold text-base hover:shadow-[0_8px_20px_rgba(0,95,115,0.15)] active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2 min-h-[48px] cursor-pointer"
      >
        {isGenerating ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Melakukan Analisis Psikologi Produk...</span>
          </>
        ) : (
          <>
            <span>Mulai Analisis Produk AI</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
