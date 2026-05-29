"use client";
import React, { useState } from "react";

interface ProductIntelSectionProps {
  title: string;
  icon: React.ReactNode;
  content: string;
}

export default function ProductIntelSection({ title, icon, content }: ProductIntelSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  };

  const parseInline = (line: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const tokens = line.split(regex);

    return tokens.map((token, idx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={idx} className="font-extrabold text-gray-950">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        return <code key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-pink-600 font-semibold">{token.slice(1, -1)}</code>;
      }
      return token;
    });
  };

  const renderMarkdown = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-5 my-3 space-y-1.5 text-gray-700 text-sm font-['Inter']">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{parseInline(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        flushList(index);
        elements.push(
          <h3 key={index} className="text-base font-bold text-gray-900 mt-5 mb-2 font-['Montserrat']">
            {parseInline(trimmed.substring(4))}
          </h3>
        );
      } else if (trimmed.startsWith("#### ")) {
        flushList(index);
        elements.push(
          <h4 key={index} className="text-sm font-bold text-gray-800 mt-4 mb-1.5 font-['Montserrat']">
            {parseInline(trimmed.substring(5))}
          </h4>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList(index);
        elements.push(
          <h2 key={index} className="text-lg font-extrabold text-gray-950 mt-6 mb-3 border-b border-gray-100 pb-1.5 font-['Montserrat']">
            {parseInline(trimmed.substring(3))}
          </h2>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        inList = true;
        listItems.push(trimmed.substring(2));
      } else if (trimmed.match(/^\d+\.\s/)) {
        flushList(index);
        const match = trimmed.match(/^(\d+)\.\s(.*)/);
        const num = match ? match[1] : "";
        const c = match ? match[2] : trimmed;
        elements.push(
          <div key={index} className="flex gap-2 text-sm text-gray-700 leading-relaxed font-['Inter'] my-2 pl-2">
            <span className="font-extrabold text-[var(--color-brand-teal)] shrink-0">{num}.</span>
            <p className="flex-1">{parseInline(c)}</p>
          </div>
        );
      } else if (trimmed === "") {
        flushList(index);
      } else {
        flushList(index);
        elements.push(
          <p key={index} className="text-sm text-gray-700 leading-relaxed font-['Inter'] my-2.5">
            {parseInline(trimmed)}
          </p>
        );
      }
    });

    flushList(lines.length);
    return <div className="space-y-1">{elements}</div>;
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,103,125,0.03)] border border-gray-100 relative group overflow-hidden transition-all hover:shadow-[0_8px_40px_rgba(0,103,125,0.06)]">
      {/* Background soft accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-teal)]/3 rounded-full blur-2xl pointer-events-none transition-all group-hover:scale-125" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[var(--color-brand-teal)]/10 text-[var(--color-brand-teal)] rounded-2xl shrink-0">
            {icon}
          </div>
          <h2 className="text-base sm:text-lg font-extrabold font-['Montserrat'] text-gray-900 leading-tight">
            {title}
          </h2>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 shrink-0 ${
            copied
              ? "bg-emerald-500 text-white shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
              : "bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800"
          }`}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 prose prose-slate max-w-none">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}
