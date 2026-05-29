"use client";

interface MarketplaceSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export default function MarketplaceSelect({ value, onChange }: MarketplaceSelectProps) {
  const marketplaces = [
    { label: "Shopee", val: "Shopee" },
    { label: "TikTok Shop", val: "TikTok Shop" },
    { label: "Tokopedia", val: "Tokopedia" },
    { label: "Lazada", val: "Lazada" },
    { label: "Lainnya", val: "Lainnya" },
  ];

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)]/15 focus:border-[var(--color-brand-teal)] bg-white text-gray-900 text-sm min-h-[44px] appearance-none cursor-pointer transition-all"
      >
        <option value="" className="text-gray-400">Pilih marketplace...</option>
        {marketplaces.map((m) => (
          <option key={m.val} value={m.val} className="text-gray-900 py-2">
            {m.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
