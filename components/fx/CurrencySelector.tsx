"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencyCode } from "@/lib/fx";

const currencies: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD" },
  { code: "EUR", label: "€" },
  { code: "GBP", label: "£" },
  { code: "TSH", label: "TSh" },
];

type CurrencySelectorProps = {
  className?: string;
  variant?: "desktop" | "mobile";
  onChange?: () => void;
};

export function CurrencySelector({
  className = "",
  variant = "desktop",
  onChange,
}: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency();

  const baseClasses =
    variant === "desktop"
      ? "rounded-full border border-sb-mist/60 bg-white/90 px-3 py-1.5 text-[0.85rem] font-medium text-sb-ink/80 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sb-ocean/50"
      : "w-full rounded-full border border-sb-mist/60 bg-white/90 px-3 py-2 text-[0.85rem] font-medium text-sb-ink/80 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sb-ocean/50";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CurrencyCode);
    onChange?.();
  };

  return (
    <select
      value={currency}
      onChange={handleChange}
      className={`${baseClasses} ${className}`}
    >
      {currencies.map((curr) => (
        <option key={curr.code} value={curr.code}>
          {curr.label}
        </option>
      ))}
    </select>
  );
}

