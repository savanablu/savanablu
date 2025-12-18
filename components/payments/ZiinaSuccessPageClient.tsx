"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Client component to handle history replacement on Ziina success page
 * Prevents users from going back to the booking hold page after payment
 */
export function ZiinaSuccessPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Mark in sessionStorage that payment is complete
    if (bookingId) {
      sessionStorage.setItem(`booking_${bookingId}_confirmed`, "true");
    }

    // Replace current history entry to prevent back navigation to hold page
    // Push a new state so back button goes to the page before the hold page
    window.history.pushState(null, "", window.location.href);

    // Intercept back button
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      // If user tries to go back to hold page, redirect to home
      if (currentPath === "/booking/success" || 
          (currentPath.includes("/booking/success") && !currentPath.includes("/ziina/success"))) {
        router.replace("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, bookingId]);

  return null;
}

