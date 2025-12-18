"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestZiinaPage() {
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      setRedirectUrl(null);

      const res = await fetch("/api/ziina/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd: 10,
          description: "Test payment - USD 10",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to create payment");
        return;
      }

      const data = await res.json();
      if (data.redirectUrl) {
        setRedirectUrl(data.redirectUrl);
      } else {
        setError("No redirect URL received");
      }
    } catch (e) {
      console.error("Error:", e);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      // Auto-redirect after 2 seconds
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  return (
    <main className="min-h-screen bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-wide sm:text-4xl mb-8">
          Ziina Payment Test - USD 10
        </h1>

        {!redirectUrl && !error && (
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-sb-cream/80">
              Click the button below to create a payment intent for USD 10 and
              get redirected to Ziina&apos;s payment page.
            </p>

            <button
              onClick={createPayment}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-sb-cream px-6 py-3 text-base font-semibold tracking-wide text-sb-deep hover:bg-sb-cream/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating payment..." : "Create Payment (USD 10)"}
            </button>
          </div>
        )}

        {redirectUrl && (
          <div className="space-y-4 rounded-2xl border border-sb-cream/20 bg-sb-cream/5 p-6">
            <p className="text-base font-semibold text-sb-cream">
              Payment created successfully!
            </p>
            <p className="text-sm text-sb-cream/80">
              Redirecting to Ziina payment page in 2 seconds...
            </p>
            <div className="space-y-2">
              <p className="text-xs font-medium text-sb-cream/70">
                Redirect URL:
              </p>
              <a
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all text-xs text-sb-cream/90 underline hover:text-sb-cream"
              >
                {redirectUrl}
              </a>
            </div>
            <a
              href={redirectUrl}
              className="inline-flex items-center justify-center rounded-full border border-sb-cream/40 bg-sb-cream/10 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream hover:border-sb-cream hover:bg-sb-cream/20"
            >
              Go to Payment Page →
            </a>
          </div>
        )}

        {error && (
          <div className="space-y-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <p className="text-base font-semibold text-red-300">Error</p>
            <p className="text-sm text-red-200/80">{error}</p>
            <button
              onClick={createPayment}
              className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/20 px-5 py-2.5 text-sm font-medium tracking-wide text-red-200 hover:bg-red-500/30"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium tracking-wide text-sb-cream/80 hover:text-sb-cream"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

