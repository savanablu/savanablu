"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Client component to check if booking is already confirmed and redirect
 * Prevents showing hold page if payment is already complete
 */
export function BookingHoldPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only check if we have a bookingId
    if (!bookingId || isRedirecting) return;

    // First check sessionStorage for quick redirect
    if (typeof window !== "undefined") {
      const isConfirmedInStorage = sessionStorage.getItem(`booking_${bookingId}_confirmed`);
      if (isConfirmedInStorage === "true") {
        setIsRedirecting(true);
        router.replace(`/booking/ziina/success?bookingId=${encodeURIComponent(bookingId)}`);
        return;
      }
    }

    const checkBookingStatus = async () => {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const booking = await res.json();
          
          // Check if booking is already confirmed
          const isConfirmed = 
            booking.paymentStatus === "confirmed" || 
            booking.status === "confirmed" ||
            booking.confirmedAt;

          if (isConfirmed) {
            setIsRedirecting(true);
            // Mark in sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem(`booking_${bookingId}_confirmed`, "true");
            }
            // Use replace to avoid adding to history
            router.replace(`/booking/ziina/success?bookingId=${encodeURIComponent(bookingId)}`);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking booking status:", err);
      }
    };

    // Check immediately
    checkBookingStatus();
  }, [bookingId, router, isRedirecting]);

  // Show loading state while checking/redirecting
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-sb-deep/90">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sb-cream border-r-transparent"></div>
          <p className="text-sm text-sb-cream/80">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}

