"use client";

import { useState, useMemo } from "react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

type ZiinaDepositButtonProps = {
  bookingId?: string;
  totalUsd: number;
  label?: string;
};

export function ZiinaDepositButton({
  bookingId,
  totalUsd,
  label = "Pay 20% advance via Ziina",
}: ZiinaDepositButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rateFromEnv = Number(
    process.env.NEXT_PUBLIC_ZIINA_USD_TO_AED_RATE ?? "3.7"
  );
  const fxRate =
    Number.isFinite(rateFromEnv) && rateFromEnv > 0 ? rateFromEnv : 3.7;

  const { depositUsd, depositAed } = useMemo(() => {
    const rawUsd = totalUsd * 0.2;
    const roundedUsd = Math.round(rawUsd * 100) / 100;

    const rawAed = roundedUsd * fxRate;
    const roundedAed = Math.round(rawAed * 100) / 100;

    return {
      depositUsd: roundedUsd,
      depositAed: roundedAed,
    };
  }, [totalUsd, fxRate]);

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      const description = bookingId
        ? `Savana Blu – 20% advance for booking ${bookingId}`
        : "Savana Blu – 20% advance payment";

      console.log("Creating Ziina payment intent:", { amountUsd: depositUsd, bookingId, description });

      const res = await fetch("/api/ziina/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: depositUsd,
          bookingId,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Ziina intent error:", {
          status: res.status,
          statusText: res.statusText,
          data,
        });
        
        // Show more helpful error message
        const errorMsg = data.error || "Please try again.";
        setError(`We couldn't start the payment right now. ${errorMsg}${data.details ? ` (Details: ${data.details.substring(0, 100)})` : ""}`);
        return;
      }

      const data = await res.json();
      console.log("Ziina payment intent created:", data);

      if (!data.redirectUrl) {
        console.error("No redirectUrl in response:", data);
        setError("Payment link was not returned. Please try again.");
        return;
      }

      console.log("Redirecting to Ziina:", data.redirectUrl);
      window.location.href = data.redirectUrl as string;
    } catch (e) {
      console.error("Ziina deposit button error:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-sb-cream to-sb-cream/95 px-6 py-3.5 text-sm font-semibold tracking-wide text-sb-deep shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-sb-cream/90">
            <svg
              className="h-5 w-5 animate-spin text-sb-deep"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        <div className={`flex items-center gap-2 ${loading ? "invisible" : ""}`}>
          <svg
            className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="relative">{label}</span>
          <svg
            className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </button>

      <p className="text-center text-xs text-sb-cream/70">
        20% advance amount:{" "}
        <span className="font-semibold text-sb-cream">
          <PriceDisplay amountUSD={depositUsd} />
        </span>
      </p>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-xs text-red-300">
            {error} If it continues, please contact us on WhatsApp or email.
          </p>
        </div>
      )}

      <p className="text-center text-[11px] leading-relaxed text-sb-cream/60">
        We&apos;ll charge this 20% advance now via Ziina to our UAE account. The
        remaining balance is paid in Zanzibar on the day of your experience.
      </p>
    </div>
  );
}
