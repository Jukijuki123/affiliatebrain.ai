"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setIsLoading(true);
    if (auth && auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { onboardingDone: true });
      } catch (err) {
        console.error("Failed to update onboarding status", err);
      }
    }
    setIsLoading(false);
    onClose();
  };

  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="10" width="18" height="10" rx="2" />
          <path d="M12 2v4m-5 4V7m10 3V7M8 15h.01M16 15h.01M9 18h6" />
        </svg>
      ),
      title: "Apa itu AffiliateBrain?",
      desc: "Asisten AI pribadi Anda yang dirancang khusus untuk membantu affiliator TikTok Shop, Shopee Video, dan Reels Indonesia dalam merancang ide & skrip konten secara instan.",
      accent: "bg-[var(--color-brand-teal-light)] text-[var(--color-brand-teal)] border border-[var(--color-brand-teal)]/10",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Cara Kerjanya",
      desc: "Cukup masukkan nama produk atau link toko. AI kami akan otomatis memetakan target pembeli, merumuskan keunikan produk, serta merangkai skrip video promosi yang siap rekam.",
      accent: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 5.84M2 22l4-4m16-16l-8 8M14 6l4 4" />
        </svg>
      ),
      title: "Siap FYP & Banjir Komisi?",
      desc: "Dapatkan hook super memikat di 3 detik pertama, jalan cerita video yang natural (no-cringe), lengkap dengan rekomendasi caption, hashtag viral, hingga waktu upload terbaik.",
      accent: "bg-[var(--color-brand-coral-light)] text-[var(--color-brand-coral)] border border-[var(--color-brand-coral)]/10",
    }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={handleFinish} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-10 z-10 transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Step Indicator Top */}
        <div className="flex justify-center gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                step === i + 1 
                  ? "w-8 bg-[var(--color-brand-teal)]" 
                  : "w-2 bg-gray-150"
              }`}
            />
          ))}
        </div>

        {/* Content Wrapper */}
        <div className="text-center flex flex-col items-center">
          
          {/* Stylized Icon container */}
          <div className={`w-16 h-16 rounded-2xl ${currentStepData.accent} flex items-center justify-center mb-6 shadow-sm`}>
            {currentStepData.icon}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] mb-3 text-gray-900 leading-tight">
            {currentStepData.title}
          </h2>
          
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm font-['Inter']">
            {currentStepData.desc}
          </p>

          {/* Action Buttons */}
          <div className="w-full flex gap-3 mt-4">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                type="button"
                className="flex-1 py-3 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] min-h-[44px] cursor-pointer"
              >
                Kembali
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                type="button"
                className="flex-1 py-3 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl font-medium text-sm transition-all active:scale-[0.98] min-h-[44px] cursor-pointer"
              >
                Lewati
              </button>
            )}

            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                type="button"
                className="flex-1 bg-[var(--color-brand-teal)] hover:bg-[#004d5e] text-white py-3 rounded-xl font-semibold text-sm hover:shadow-[0_4px_12px_rgba(0,95,115,0.15)] active:scale-[0.98] transition-all min-h-[44px] cursor-pointer"
              >
                Lanjut
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                type="button"
                disabled={isLoading}
                className="flex-1 bg-[var(--color-brand-coral)] hover:bg-[#e04426] text-white py-3 rounded-xl font-bold text-sm hover:shadow-[0_4px_12px_rgba(249,87,56,0.15)] active:scale-[0.98] transition-all disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : null}
                Mulai Sekarang!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
