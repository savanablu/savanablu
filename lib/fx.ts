import fxSettings from "@/data/fx-settings.json";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "TSH";

export interface FxConfig {
  baseCurrency: string;
  rates: Record<string, number>;
  markups: Record<string, number>;
}

// Load FX settings
const fx: FxConfig = {
  baseCurrency: fxSettings.baseCurrency,
  rates: fxSettings.rates,
  markups: fxSettings.markups,
};

/**
 * Converts an amount from base currency (USD) to target currency
 * Applies markup and rounding based on fx-settings.json
 */
export function convertAmount(
  amountUSD: number,
  targetCurrency: CurrencyCode,
  fxConfig: FxConfig = fx
): number {
  if (targetCurrency === "USD") {
    return amountUSD;
  }

  const rate = fxConfig.rates[targetCurrency] ?? 1;
  const markup = fxConfig.markups[targetCurrency] ?? 0;

  // Convert: base amount * rate * (1 + markup)
  const converted = amountUSD * rate * (1 + markup);

  return converted;
}

/**
 * Rounds a number based on fx.json rounding strategy
 * Currently uses "nearest" with precision 0 (round to whole number)
 */
function roundAmount(amount: number): number {
  // From fx.json: "strategy": "nearest", "precision": 0
  return Math.round(amount);
}

/**
 * Formats a price for display
 * Converts from USD base, applies markup, rounds, and formats with currency symbol
 */
export function formatPrice(
  amountUSD: number,
  currency: CurrencyCode,
  fxConfig: FxConfig = fx
): string {
  const converted = convertAmount(amountUSD, currency, fxConfig);
  const rounded = roundAmount(converted);

  // Format with locale-aware number formatting
  const formatted = rounded.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Currency labels
  const labels: Record<CurrencyCode, string> = {
    USD: "USD",
    EUR: "€",
    GBP: "£",
    TSH: "TSh",
  };

  const label = labels[currency] || currency;

  return `${label} ${formatted}`;
}

