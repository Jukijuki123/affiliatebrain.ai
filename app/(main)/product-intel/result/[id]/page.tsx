"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { ProductIntelDocument } from "@/lib/types";
import ProductIntelSection from "@/components/result/ProductIntelSection";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

export default function ProductIntelResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const { showToast } = useToast();

  const [data, setData] = useState<ProductIntelDocument | null>(null);
  const [loading, setLoading] = useState(!!auth);
  const [error, setError] = useState(!auth ? "Firebase Auth belum diinisialisasi. Periksa berkas .env.local Anda." : "");

  useEffect(() => {
    if (!id) return;

    // Trigger toast if navigated from a successful generation
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("success") === "true") {
      showToast("Analisis Kecerdasan Produk Berhasil Dibuat! 🧠🔥", "success");
      // Clean up the URL parameter gracefully
      window.history.replaceState(null, "", window.location.pathname);
    }

    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid, "product-intel", id);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setData({ id: snap.id, ...snap.data() } as ProductIntelDocument);
          } else {
            setError("Data analisis tidak ditemukan");
          }
        } catch (err) {
          console.error(err);
          setError("Gagal memuat data analisis");
        }
      } else {
        setError("Silakan login untuk melihat hasil");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[var(--color-brand-teal)]/10 animate-ping duration-1000" />
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--color-brand-teal)] relative z-10"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-16 h-16 text-amber-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Montserrat']">{error || "Terjadi kesalahan"}</h2>
        <p className="text-gray-500 mb-8 text-sm">Gagal memuat data dari server Firebase.</p>
        <Link 
          href="/product-intel" 
          className="px-6 py-3 bg-[var(--color-brand-teal)] text-white font-semibold rounded-xl hover:shadow-[0_4px_12px_rgba(0,103,125,0.2)] active:scale-95 transition-all text-sm"
        >
          Kembali ke Form
        </Link>
      </div>
    );
  }

  const { output } = data;

  const categoryLabels: Record<string, string> = {
    skincare: "Skincare & Kecantikan",
    fashion: "Fashion & Pakaian",
    elektronik: "Elektronik & Gadget",
    makanan: "Makanan & Minuman",
    kesehatan: "Kesehatan & Suplemen",
    rumah_tangga: "Rumah Tangga",
    olahraga: "Olahraga",
    otomotif: "Otomotif",
    lainnya: "Lainnya"
  };

  // Reusable beautiful SVG icons
  const iconDNA = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );

  const iconPersona = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const iconPainPoint = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  const iconTrigger = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  const iconBenefit = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const iconObjection = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const iconAngle = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const iconHook = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  );

  const iconCTA = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
  );

  const iconExecution = (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 pb-28">
      {/* Back to main link */}
      <div className="mb-6">
        <Link 
          href="/product-intel" 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[var(--color-brand-teal)] transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Form
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,103,125,0.03)] border border-gray-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-brand-teal)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col gap-3.5 relative z-10 flex-1">
          <span className="text-[10px] font-bold text-white bg-[var(--color-brand-teal)] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans self-start">
            Laporan Intelijen Produk Sukses 🧠
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Montserrat'] text-gray-900 leading-tight">
            {data.title}
          </h1>
          <div className="flex flex-wrap gap-2.5 items-center text-xs">
            <span className="bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] font-bold px-3 py-1 rounded-lg border border-[var(--color-brand-teal)]/15">
              📁 {categoryLabels[data.category] || data.category}
            </span>
            {data.marketplace && (
              <span className="bg-orange-50 text-orange-700 font-bold px-3 py-1 rounded-lg border border-orange-100">
                🛒 {data.marketplace}
              </span>
            )}
            {data.price && (
              <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg border border-emerald-100">
                💰 Rp{data.price.replace(/^Rp/i, "")}
              </span>
            )}
            {data.rating !== null && (
              <span className="bg-amber-50 text-amber-700 font-bold px-3 py-1 rounded-lg border border-amber-100">
                ⭐️ {data.rating.toFixed(1)} / 5.0
              </span>
            )}
          </div>

          {/* Keywords Chips */}
          {data.reviewKeywords && data.reviewKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 items-center">
              <span className="text-xs font-bold text-gray-400 mr-1 font-sans">Kata Kunci Ulasan:</span>
              {data.reviewKeywords.map((kw, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium font-sans">
                  #{kw}
                </span>
              ))}
            </div>
          )}

          {/* Scraped / Link indicator */}
          {data.productLink && (
            <div className="mt-2 text-xs font-medium">
              <a 
                href={data.productLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[var(--color-brand-teal)] hover:underline inline-flex items-center gap-1"
              >
                <span>Lihat Tautan Produk Asli</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="shrink-0 z-10 flex gap-3 flex-wrap">
          <Link 
            href="/product-intel"
            className="btn-primary text-sm px-6 py-3.5 flex items-center gap-2"
          >
            <span>Analisis Baru</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main 10 Sections Grid */}
      <div className="flex flex-col gap-8">
        <ProductIntelSection title="1. Product DNA" icon={iconDNA} content={output.productDNA} />
        <ProductIntelSection title="2. Buyer Persona Detection" icon={iconPersona} content={output.buyerPersona} />
        <ProductIntelSection title="3. Core Pain Point Analysis" icon={iconPainPoint} content={output.corePainPoint} />
        <ProductIntelSection title="4. Buying Trigger Detection" icon={iconTrigger} content={output.buyingTriggers} />
        <ProductIntelSection title="5. Key Benefit Compression" icon={iconBenefit} content={output.keyBenefits} />
        <ProductIntelSection title="6. Objection Mapping" icon={iconObjection} content={output.objectionMapping} />
        <ProductIntelSection title="7. Best Content Angle Prediction" icon={iconAngle} content={output.bestContentAngles} />
        <ProductIntelSection title="8. Hook Generation Engine" icon={iconHook} content={output.videoHooks} />
        <ProductIntelSection title="9. CTA Strategy" icon={iconCTA} content={output.ctaStrategy} />
        <ProductIntelSection title="10. Content Execution Recommendation" icon={iconExecution} content={output.contentExecution} />
      </div>

      {/* Sticky Bottom Action for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] sm:hidden z-10 flex justify-center">
         <Link 
          href="/product-intel"
          className="w-full max-w-sm bg-[var(--color-brand-teal)] text-white text-center py-3.5 rounded-xl font-bold text-sm hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>Mulai Analisis Baru</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
