"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/fx";

type MoneyDisplayProps = {
  amountUSD: number;
  className?: string;
};

export function MoneyDisplay({ amountUSD, className = "" }: MoneyDisplayProps) {
  const { currency, fx } = useCurrency();
  const formatted = formatPrice(amountUSD, currency, fx);

  return <span className={className}>{formatted}</span>;
}





