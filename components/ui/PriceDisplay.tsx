"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/fx";

type PriceDisplayProps = {
  amountUSD: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function PriceDisplay({
  amountUSD,
  prefix,
  suffix,
  className = "",
}: PriceDisplayProps) {
  const { currency, fx } = useCurrency();
  const formatted = formatPrice(amountUSD, currency, fx);

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

