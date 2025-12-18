type BookingRedirectParams = {
  bookingId: string;
  experienceTitle: string;
  totalUsd: number;
  dateLabel: string; // e.g., "14 Dec 2025"
  type?: string; // "zanzibar-tour" | "safari" | anything else
};

/**
 * Builds the booking success page URL with query parameters
 * Use this after creating a new booking to redirect to the success page with payment option
 * 
 * Example usage in a route handler:
 * ```ts
 * import { redirect } from "next/navigation";
 * const url = buildBookingSuccessUrl({ bookingId, experienceTitle, totalUsd, dateLabel, type: "zanzibar-tour" });
 * redirect(url);
 * ```
 */
export function buildBookingSuccessUrl(params: BookingRedirectParams): string {
  const searchParams = new URLSearchParams({
    bookingId: params.bookingId,
    experienceTitle: params.experienceTitle,
    totalUsd: String(params.totalUsd),
    date: params.dateLabel,
  });

  if (params.type) {
    searchParams.set("type", params.type);
  }

  return `/booking/success?${searchParams.toString()}`;
}

