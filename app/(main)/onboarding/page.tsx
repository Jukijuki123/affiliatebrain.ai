"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setIsLoading(true);
    if (auth && auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { onboardingDone: true });
      } catch (err) {
        console.error("Failed to update onboarding status", err);
      }
    }
    router.push("/generate");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 transition-all">
        {step === 1 && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat'] mb-4 text-[#00677d]">Apa itu AffiliateBrain?</h2>
            <p className="text-gray-600 mb-10 font-['Inter'] leading-relaxed">Asisten AI pribadi Anda yang dirancang khusus untuk affiliator TikTok Shop, Shopee Video, dan Reels Indonesia.</p>
            <div className="flex gap-4">
              <button onClick={handleFinish} className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition">Lewati</button>
              <button onClick={() => setStep(2)} className="flex-1 bg-[#00677d] text-white py-3 rounded-xl font-medium hover:opacity-90 transition">Lanjut</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat'] mb-4 text-[#00677d]">Cara Kerjanya</h2>
            <p className="text-gray-600 mb-10 font-['Inter'] leading-relaxed">Anda cukup masukkan nama atau link produk. Kami akan menganalisis audiens, mencari sudut pandang (angle) konten, dan membuatkan skrip utuh untuk Anda.</p>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition">Kembali</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-[#00677d] text-white py-3 rounded-xl font-medium hover:opacity-90 transition">Lanjut</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Montserrat'] mb-4 text-[#00677d]">Siap FYP?</h2>
            <p className="text-gray-600 mb-10 font-['Inter'] leading-relaxed">Dapatkan hook yang bikin penonton berhenti scroll, skrip yang natural, lengkap dengan hashtag dan rekomendasi jadwal posting.</p>
            <button 
              onClick={handleFinish} 
              disabled={isLoading}
              className="w-full bg-[#8429c8] text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Menyiapkan akun..." : "Mulai Generate Sekarang"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
