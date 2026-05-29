"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductIntelForm from "@/components/form/ProductIntelForm";
import { ProductIntelInput } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

const loadingMessages = [
  "Membaca data dan spesifikasi produk...",
  "Melakukan scraping link produk untuk riset ulasan...",
  "Mengurai psikologi, trigger belanja, dan hambatan calon pembeli...",
  "Memetakan 10 pilar analisis kecerdasan produk...",
  "Menyusun hook video scroll-stopping untuk afiliator...",
  "Hampir selesai, memformat laporan intelijen produk... 🔥",
];

export default function ProductIntelPage() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isGenerating) return;
    const timer = setInterval(() => {
      setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleGenerate = async (data: ProductIntelInput) => {
    setIsGenerating(true);
    setGlobalError("");

    try {
      if (!auth || !auth.currentUser) {
        throw new Error("Silakan login kembali atau periksa konfigurasi Firebase Anda.");
      }
      const token = await auth.currentUser.getIdToken();

      const res = await fetch("/api/product-intel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      let resData;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        resData = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response received:", text);
        throw new Error(`Server error: ${res.status}. Gagal memproses data.`);
      }

      if (!res.ok) {
        throw new Error(resData?.error || "Gagal menghasilkan analisis produk");
      }

      router.push(`/product-intel/result/${resData.id}?success=true`);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      setGlobalError(errorMessage);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center lg:text-left">
        <span className="text-[10px] font-bold text-white bg-[var(--color-brand-teal)] px-3 py-1 rounded-full uppercase tracking-wider font-sans inline-block mb-3">
          Fitur Premium Baru 🚀
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Montserrat'] text-[var(--color-brand-teal)] leading-tight pb-1">
          Analisis Kecerdasan Produk AI
        </h1>
        <p className="text-gray-500 mt-2 font-['Inter'] max-w-xl text-sm sm:text-base">
          Temukan 10 pilar analisis psikologi pembeli, trigger konversi, tag ulasan, serta formula angle & hook video komersial.
        </p>
      </div>

      {isGenerating ? (
        <div className="bg-white p-8 sm:p-16 rounded-3xl shadow-[0_4px_30px_rgba(0,103,125,0.06)] border border-gray-100 flex flex-col items-center justify-center min-h-[450px]">
          {/* Pulsing ring and rotating indicator */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-[var(--color-brand-teal)]/10 animate-ping duration-1000" />
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[var(--color-brand-teal)] relative z-10" />
          </div>
          <p className="text-xl font-bold text-gray-800 text-center font-['Montserrat'] mb-2">
            AI Sedang Menganalisis Produk...
          </p>
          <p className="text-sm text-gray-500 animate-pulse text-center font-['Inter'] max-w-md leading-relaxed">
            {loadingMessages[loadingMsgIdx]}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Area */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {globalError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-['Inter'] text-sm flex gap-2.5 items-start">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span>{globalError}</span>
              </div>
            )}
            <ProductIntelForm onSubmit={handleGenerate} isGenerating={false} />
          </div>

          {/* Sidebar Insights */}
          <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Guide Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-[var(--color-brand-teal)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-gray-900 font-['Montserrat']">Kenapa Riset Produk?</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-['Inter'] mb-3">
                Sebelum membuat konten, memahami **psikologi produk** dan **hambatan pembeli** adalah kunci utama untuk meningkatkan rasio klik & penjualan (conversion rate) afiliasi Anda.
              </p>
              <ul className="flex flex-col gap-3 text-xs text-gray-600 font-['Inter']">
                <li className="flex gap-2">
                  <span className="text-[var(--color-brand-teal)] font-bold">✓</span>
                  <span><strong>Product DNA</strong>: Mengapa orang membeli secara impulsif.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-brand-teal)] font-bold">✓</span>
                  <span><strong>Objection Mapping</strong>: Menangkis keraguan pembeli sebelum membeli.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[var(--color-brand-teal)] font-bold">✓</span>
                  <span><strong>Hook Generator</strong>: Formula video viral 3 detik pertama.</span>
                </li>
              </ul>
            </div>

            {/* Guide Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-[var(--color-brand-teal)]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
                <h3 className="font-bold text-base text-gray-900 font-['Montserrat']">Scraping URL Otomatis</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-['Inter']">
                Masukkan Link Produk Shopee, Tokopedia, atau marketplace lainnya. Mesin AI kami akan secara otomatis **mengikis (scrape) deskripsi & judul web** untuk riset produk yang jauh lebih akurat tanpa perlu diketik manual!
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
