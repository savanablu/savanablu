// components/analytics/CookieConsent.tsx

"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "savanablu-cookie-consent";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setShowBanner(false);
    // Trigger a custom event that tracking components can listen to
    window.dispatchEvent(new CustomEvent("cookieConsentAccepted"));
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent("cookieConsentRejected"));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-sb-night/95 backdrop-blur-sm border-t border-sb-cream/20 shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-sb-cream mb-1">
              Cookie Consent
            </p>
            <p className="text-xs leading-relaxed text-sb-cream/80">
              We use cookies to analyze website traffic and improve your experience. 
              Your data is anonymized and used only for analytics purposes.{" "}
              <a
                href="/privacy"
                className="underline hover:text-sb-cream transition-colors"
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-xs font-semibold text-sb-cream/80 hover:text-sb-cream border border-sb-cream/30 rounded-lg hover:border-sb-cream/50 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-semibold text-sb-cream bg-sb-ocean hover:bg-sb-lagoon rounded-lg transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Check if user has accepted cookies
 */
export function hasCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

