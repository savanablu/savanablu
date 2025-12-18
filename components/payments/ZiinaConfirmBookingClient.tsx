"use client";

import { useEffect, useState, useRef } from "react";

type Status = "idle" | "saving" | "done" | "error";

export function ZiinaConfirmBookingClient({
  bookingId,
}: {
  bookingId?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const hasCalledRef = useRef(false); // Prevent multiple calls

  useEffect(() => {
    if (!bookingId || hasCalledRef.current) return;

    let cancelled = false;

    const run = async () => {
      try {
        // Mark as called immediately to prevent duplicate calls
        hasCalledRef.current = true;
        setStatus("saving");
        
        const res = await fetch("/api/ziina/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        if (!res.ok) {
          throw new Error(`Bad status ${res.status}`);
        }

        const data = await res.json();
        
        if (!cancelled) {
          if (data.alreadyProcessed) {
            setStatus("done");
          } else {
            setStatus("done");
          }
        }
      } catch (err) {
        console.error("Error marking booking paid:", err);
        if (!cancelled) {
          setStatus("error");
          // Reset ref on error so it can be retried
          hasCalledRef.current = false;
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  if (!bookingId) return null;

  return (
    <p className="mt-4 text-xs leading-relaxed text-sb-cream/70">
      {status === "saving" &&
        "We're updating your booking and sending a confirmation email…"}
      {status === "done" &&
        "Your confirmation email is on its way. You don't need to do anything else."}
      {status === "error" &&
        "Your payment went through, but we couldn't update the booking automatically. If you don't see a confirmation email soon, please contact us with your payment details."}
    </p>
  );
}

