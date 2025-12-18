"use client";

import { useCurrency } from "@/contexts/CurrencyContext";

export function CurrencyIcon({ className = "h-4 w-4" }: { className?: string }) {
  const { currency } = useCurrency();

  // Return currency symbol as text for most currencies
  if (currency === "EUR") {
    return <span className={`${className} text-sb-shell/90 font-semibold`}>€</span>;
  }
  
  if (currency === "GBP") {
    return <span className={`${className} text-sb-shell/90 font-semibold`}>£</span>;
  }
  
  if (currency === "TSH") {
    return <span className={`${className} text-sb-shell/90 font-semibold text-xs`}>TSh</span>;
  }

  // Default to USD dollar sign icon
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

