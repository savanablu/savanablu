"use client";

import { useState } from "react";

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

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      const depositUsd = totalUsd * 0.2;
      const depositUsdRounded = Math.round(depositUsd * 100) / 100;

      const description = bookingId
        ? `Savana Blu – 20% advance for booking ${bookingId}`
        : "Savana Blu – 20% advance payment";

      const res = await fetch("/api/ziina/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: depositUsdRounded,
          bookingId,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Ziina intent error:", data);
        setError("We couldn't start the payment right now. Please try again.");
        return;
      }

      const data = await res.json();

      if (!data.redirectUrl) {
        setError("Payment link was not returned. Please try again.");
        return;
      }

      window.location.href = data.redirectUrl as string;
    } catch (e) {
      console.error("Ziina deposit button error:", e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-sb-cream px-5 py-2.5 text-sm font-semibold tracking-wide text-sb-deep hover:bg-sb-cream/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Opening secure payment..." : label}
      </button>
      {error && (
        <p className="text-xs text-sb-cream/80">
          {error} If it continues, please contact us on WhatsApp or email.
        </p>
      )}
      <p className="text-[11px] leading-relaxed text-sb-cream/70">
        We&apos;ll charge a small 20% advance now via Ziina to our UAE account. The
        remaining balance is paid in Zanzibar on the day of your experience.
      </p>
    </div>
  );
}

