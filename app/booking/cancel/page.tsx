import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking not completed | Savana Blu",
  description:
    "Your booking was not completed. No payment has been taken for your Savana Blu booking.",
};

export default function BookingCancelPage() {
  return (
    <main className="min-h-[60vh] bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-sb-cream/60">
          Savana Blu · Booking not completed
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
          Your booking isn&apos;t confirmed yet
        </h1>

        <p className="mt-4 text-base leading-relaxed text-sb-cream/80">
          It looks like the booking process wasn&apos;t completed. That&apos;s
          absolutely fine – nothing has been charged and your preferred date
          hasn&apos;t been confirmed.
        </p>

        <p className="mt-3 text-base leading-relaxed text-sb-cream/80">
          If you&apos;d still like to plan something in Zanzibar, you can start
          again or send us a quick note and we&apos;ll help with calm,
          human advice – no pressure.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/zanzibar-tours"
            className="inline-flex items-center rounded-full border border-sb-cream/40 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream hover:border-sb-cream hover:bg-sb-cream/10"
          >
            Browse Zanzibar tours
          </Link>

          <Link
            href="/safaris"
            className="inline-flex items-center rounded-full border border-sb-cream/20 bg-sb-cream/10 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream hover:bg-sb-cream/20"
          >
            View safari ideas
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-medium tracking-wide text-sb-cream/80 hover:text-sb-cream"
          >
            Contact Savana Blu
          </Link>
        </div>
      </div>
    </main>
  );
}
