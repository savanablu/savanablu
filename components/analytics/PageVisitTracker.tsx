// components/analytics/PageVisitTracker.tsx

"use client";

import { useEffect } from "react";

type PageVisitTrackerProps = {
  slug: string;
  type: "safari" | "tour";
};

export default function PageVisitTracker({
  slug,
  type,
}: PageVisitTrackerProps) {
  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug, type }),
        });
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.warn("Failed to track page visit:", error);
      }
    };

    trackVisit();
  }, [slug, type]);

  // This component doesn't render anything
  return null;
}

