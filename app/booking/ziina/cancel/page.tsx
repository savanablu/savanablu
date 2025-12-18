import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking not completed | Savana Blu",
  description:
    "Your payment was not completed. No deposit has been taken for your Savana Blu booking.",
};

type ZiinaCancelPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export default function ZiinaCancelPage({ searchParams }: ZiinaCancelPageProps) {
  const bookingId = searchParams?.bookingId;

  return (
    <main className="min-h-[60vh] bg-sb-deep text-sb-cream">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-sb-cream/60">
          Savana Blu · Payment not completed
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-wide sm:text-4xl">
          Your booking is still on hold
        </h1>

        <div className="mt-6 rounded-2xl border border-sb-coral/30 bg-sb-coral/10 p-4">
          <p className="text-base leading-relaxed text-sb-cream/90">
            It looks like the payment page was closed before the 20% advance was
            completed. Your booking is still{" "}
            <span className="font-semibold text-sb-coral">on hold</span> for now.
          </p>
        </div>

        <p className="mt-6 text-base leading-relaxed text-sb-cream/80">
          If you&apos;d like to confirm, you can use the secure payment link in
          your email, or contact us and we&apos;ll help you with the next step.
        </p>


        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-sb-cream/40 bg-gradient-to-r from-sb-cream/5 to-sb-cream/3 px-5 py-2.5 text-sm font-medium tracking-wide text-sb-cream transition-all duration-300 hover:border-sb-cream/60 hover:bg-gradient-to-r hover:from-sb-cream/15 hover:to-sb-cream/10 hover:shadow-lg hover:shadow-sb-cream/10 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sb-lagoon/0 via-sb-lagoon/5 to-sb-lagoon/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="relative">Contact the Savana Blu team</span>
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
