"use client";

import { CurrencyIcon } from "./CurrencyIcon";

type PriceInfoBlockProps = {
  label: string;
  price: React.ReactNode;
  className?: string;
};

export function PriceInfoBlock({ label, price, className = "" }: PriceInfoBlockProps) {
  return (
    <div className={`rounded-2xl bg-sb-shell/10 backdrop-blur-sm px-4 py-3 border border-sb-shell/20 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <CurrencyIcon className="h-4 w-4 text-sb-shell/90" />
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-sb-shell/70">
          {label}
        </p>
      </div>
      <div className="font-medium text-sb-shell">
        {price}
      </div>
    </div>
  );
}

