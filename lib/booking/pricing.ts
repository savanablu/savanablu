import type { Tour } from "@/lib/data/tours";

export type PricingInput = {
  tour: Tour;
  adults: number;
  children: number;
  promoCode?: string | null;
  promoType?: "percent" | "fixed" | null;
  promoValue?: number | null;
};

export type PricingResult = {
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
};

const CHILD_DISCOUNT = 0.5;
const CURRENCY = "USD";

// Simple pricing calculation for packages (priceFrom instead of tour object)
export function calculateSimpleBookingTotal(
  priceFrom: number,
  adults: number,
  children: number
): number {
  const safeAdults = Math.max(0, adults);
  const safeChildren = Math.max(0, children);

  const adultTotal = priceFrom * safeAdults;
  const childTotal = priceFrom * CHILD_DISCOUNT * safeChildren;
  return adultTotal + childTotal;
}

// Alias for package bookings (same as calculateSimpleBookingTotal)
export function calculateBookingTotal(
  priceFrom: number,
  adults: number,
  children: number
): number;
// Tour-based booking total (returns PricingResult)
export function calculateBookingTotal(input: PricingInput): PricingResult;
// Implementation
export function calculateBookingTotal(
  priceFromOrInput: number | PricingInput,
  adults?: number,
  children?: number
): number | PricingResult {
  // If first arg is an object, it's the tour-based version
  if (typeof priceFromOrInput === "object") {
    const input = priceFromOrInput;
    const safeAdults = Math.max(0, input.adults);
    const safeChildren = Math.max(0, input.children);

    const adultTotal = input.tour.basePrice * safeAdults;
    const childTotal = input.tour.basePrice * CHILD_DISCOUNT * safeChildren;
    const subtotal = adultTotal + childTotal;

    // Calculate discount
    let discount = 0;
    if (
      input.promoCode &&
      input.promoType &&
      input.promoValue !== null &&
      input.promoValue !== undefined
    ) {
      if (input.promoType === "percent") {
        discount = subtotal * (input.promoValue / 100);
      } else if (input.promoType === "fixed") {
        discount = Math.min(input.promoValue, subtotal);
      }
    }

    const total = Math.max(0, subtotal - discount);

    return {
      subtotal,
      discount,
      total,
      currency: CURRENCY
    };
  }

  // Otherwise it's the simple package version
  return calculateSimpleBookingTotal(
    priceFromOrInput,
    adults!,
    children!
  );
}

