import { Metadata } from "next";
import Link from "next/link";
import { ZiinaConfirmBookingClient } from "@/components/payments/ZiinaConfirmBookingClient";
import { ZiinaSuccessPageClient } from "@/components/payments/ZiinaSuccessPageClient";

export const metadata: Metadata = {
  title: "Booking confirmed | Savana Blu",
  description:
    "Thank you for booking with Savana Blu Luxury Expeditions. Your place is confirmed and our team will be in touch with next steps.",
};

type ZiinaSuccessPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export default function ZiinaSuccessPage({
  searchParams,
}: ZiinaSuccessPageProps) {
  const bookingId = searchParams?.bookingId;

  return (
    <main className="min-h-[60vh] bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-sb-cream/60">
          Savana Blu · Payment received
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
          Your booking is now confirmed
        </h1>

        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-base leading-relaxed text-sb-cream/90">
            Thank you – your 20% advance has been received through Ziina and your
            booking is now <span className="font-semibold text-emerald-400">fully confirmed</span>.
          </p>
        </div>

        <p className="mt-6 text-base leading-relaxed text-sb-cream/80">
          You&apos;ll pay the remaining balance in Zanzibar on the day of your tour
          or safari. We&apos;ll be in touch by email and, where helpful, WhatsApp, if
          there&apos;s anything to adjust around tides, traffic or flights.
        </p>

        {/* 🔹 This line handles updating bookings.json + sending emails */}
        <ZiinaConfirmBookingClient bookingId={bookingId} />

        {/* 🔹 Prevent back navigation to hold page */}
        <ZiinaSuccessPageClient />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/zanzibar-tours"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-sb-cream/40 bg-gradient-to-r from-sb-cream/5 to-sb-cream/3 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream transition-all duration-300 hover:border-sb-cream/60 hover:bg-gradient-to-r hover:from-sb-cream/15 hover:to-sb-cream/10 hover:shadow-lg hover:shadow-sb-cream/10 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sb-lagoon/0 via-sb-lagoon/5 to-sb-lagoon/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <svg
              className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="relative">Explore more Zanzibar tours</span>
            <svg
              className="relative ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
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
          </Link>

          <Link
            href="/safaris"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-sb-cream/20 bg-gradient-to-r from-sb-cream/10 to-sb-cream/5 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream transition-all duration-300 hover:border-sb-cream/40 hover:bg-gradient-to-r hover:from-sb-cream/20 hover:to-sb-cream/15 hover:shadow-lg hover:shadow-sb-cream/10 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sb-ocean/0 via-sb-ocean/5 to-sb-ocean/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <svg
              className="relative h-4 w-4 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="relative">View safari ideas from Zanzibar</span>
            <svg
              className="relative ml-1 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
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
          </Link>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2.5 text-sm font-medium tracking-wide text-sb-cream/80 transition-all duration-300 hover:border-sb-cream/30 hover:bg-sb-cream/5 hover:gap-3 hover:text-sb-cream hover:shadow-sm active:scale-95"
          >
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
