"use client";
import { useState, KeyboardEvent } from "react";

interface ReviewKeywordsInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

export default function ReviewKeywordsInput({ value, onChange }: ReviewKeywordsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      const newTags = [...value, trimmed];
      onChange(newTags);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-1">
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--color-brand-teal)]/20 transition-all font-sans"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="hover:bg-[var(--color-brand-teal)]/20 rounded-full w-4 h-4 inline-flex items-center justify-center text-xs ml-1 focus:outline-none transition-colors"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder="Ketik kata kunci (misal: glowing, murah) lalu tekan Enter"
          className="w-full border border-gray-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/15 focus:border-[var(--color-brand-teal)] text-sm text-gray-900 bg-white placeholder:text-gray-400 transition-all min-h-[44px]"
        />
        <button
          type="button"
          onClick={addTag}
          className="absolute inset-y-0 right-0 px-4 text-xs font-bold text-[var(--color-brand-teal)] hover:text-[#004d5e] active:scale-95 transition-all flex items-center justify-center"
        >
          Tambah
        </button>
      </div>
    </div>
  );
}
