// components/analytics/PageVisitTracker.tsx

"use client";

import { useEffect, useState } from "react";
import { hasCookieConsent } from "./CookieConsent";

type PageVisitTrackerProps = {
  slug: string;
  type: "safari" | "tour";
};

export default function PageVisitTracker({
  slug,
  type,
}: PageVisitTrackerProps) {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Check cookie consent
    const checkConsent = () => {
      setConsentGiven(hasCookieConsent());
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener("cookieConsentAccepted", handleConsentChange);
    window.addEventListener("cookieConsentRejected", handleConsentChange);

    return () => {
      window.removeEventListener("cookieConsentAccepted", handleConsentChange);
      window.removeEventListener("cookieConsentRejected", handleConsentChange);
    };
  }, []);

  useEffect(() => {
    // Only track if consent is given
    if (!consentGiven) {
      return;
    }

    // Track page visit with advanced data
    const trackVisit = async () => {
      try {
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || undefined;

        await fetch("/api/analytics/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            type,
            userAgent,
            referrer,
          }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.warn("Failed to track page visit:", error);
      }
    };

    trackVisit();
  }, [slug, type, consentGiven]);

  // This component doesn't render anything
  return null;
}

